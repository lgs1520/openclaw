class CamofoxError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR', details = null) {
    super(message);
    this.name = 'CamofoxError';
    this.code = code;
    this.details = details;
  }

  toJSON() {
    return {
      error: this.name,
      code: this.code,
      message: this.message,
      details: this.details,
    };
  }
}

class ErrorHandler {
  static handle(error, context = {}) {
    if (error instanceof CamofoxError) return error;
    
    if (error.code === 'ECONNREFUSED') {
      return new CamofoxError('Camofox 服务未运行', 'SERVICE_UNAVAILABLE', { originalError: error.message });
    }

    if (error.code === 'ETIMEDOUT') {
      return new CamofoxError('请求超时', 'REQUEST_TIMEOUT', { originalError: error.message });
    }

    return new CamofoxError(error.message || '未知错误', 'GENERIC_ERROR', { originalError: error });
  }

  static async retryWithBackoff(fn, maxRetries = 3, delayMs = 1000) {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        if (i < maxRetries - 1) {
          const waitTime = delayMs * Math.pow(2, i);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }
    throw this.handle(lastError);
  }
}

module.exports = { CamofoxError, ErrorHandler };
