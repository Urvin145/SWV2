/**
 * Structured Logger with PII Redaction
 *
 * Replaces raw console.log/console.error across API routes.
 * - Redacts phone numbers, emails, and Aadhaar-like patterns from log output
 * - Supports log levels: info, warn, error
 * - Adds ISO timestamps and prefixes for log aggregation
 *
 * In production, swap the transport for a structured logging service
 * (e.g., Pino → Datadog, Winston → CloudWatch).
 */

type LogLevel = 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  info: 0,
  warn: 1,
  error: 2,
};

const CURRENT_LOG_LEVEL: LogLevel =
  (process.env.LOG_LEVEL as LogLevel) || (process.env.NODE_ENV === 'production' ? 'warn' : 'info');

/** Patterns to redact from log messages */
const PII_PATTERNS: { regex: RegExp; replacement: string }[] = [
  // Indian phone numbers: +91XXXXXXXXXX, 91XXXXXXXXXX, 10-digit
  { regex: /(\+?91)?[6-9]\d{9}/g, replacement: '[PHONE_REDACTED]' },
  // Email addresses
  { regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, replacement: '[EMAIL_REDACTED]' },
  // Aadhaar-like 12-digit numbers
  { regex: /\b\d{4}\s?\d{4}\s?\d{4}\b/g, replacement: '[AADHAAR_REDACTED]' },
];

function redactPII(input: string): string {
  let result = input;
  for (const pattern of PII_PATTERNS) {
    result = result.replace(pattern.regex, pattern.replacement);
  }
  return result;
}

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[CURRENT_LOG_LEVEL];
}

function formatMessage(level: LogLevel, prefix: string, message: string, meta?: Record<string, unknown>): string {
  const timestamp = new Date().toISOString();
  const redactedMessage = redactPII(message);
  const base = `${timestamp} [${level.toUpperCase()}] [${prefix}] ${redactedMessage}`;

  if (meta) {
    const redactedMeta = redactPII(JSON.stringify(meta));
    return `${base} ${redactedMeta}`;
  }

  return base;
}

function createPrefixedLogger(prefix: string) {
  return {
    info(message: string, meta?: Record<string, unknown>) {
      if (!shouldLog('info')) return;
      console.log(formatMessage('info', prefix, message, meta));
    },

    warn(message: string, meta?: Record<string, unknown>) {
      if (!shouldLog('warn')) return;
      console.warn(formatMessage('warn', prefix, message, meta));
    },

    error(message: string, error?: unknown, meta?: Record<string, unknown>) {
      if (!shouldLog('error')) return;
      const errorInfo = error instanceof Error
        ? { name: error.name, message: redactPII(error.message), stack: process.env.NODE_ENV === 'production' ? undefined : error.stack }
        : error != null
          ? { raw: redactPII(String(error)) }
          : undefined;

      const merged = { ...meta, ...(errorInfo ? { error: errorInfo } : {}) };
      console.error(formatMessage('error', prefix, message, Object.keys(merged).length > 0 ? merged : undefined));
    },
  };
}

/**
 * Create a logger instance scoped to a specific module/route.
 *
 * @example
 * const logger = createLogger('Admin Bookings');
 * logger.info('Fetched 42 bookings');
 * logger.error('Query failed', err, { bookingId });
 */
export function createLogger(prefix: string) {
  return createPrefixedLogger(prefix);
}

/** Default logger for quick usage */
export const logger = createPrefixedLogger('App');
