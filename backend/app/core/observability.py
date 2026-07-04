import logging
import time
from contextlib import contextmanager
from dataclasses import dataclass, field
from typing import Any

logger = logging.getLogger("cultural_compass.observability")


@dataclass
class AICallMetrics:
    operation: str
    latency_ms: float
    model: str
    success: bool
    prompt_chars: int = 0
    response_chars: int = 0
    extra: dict[str, Any] = field(default_factory=dict)


@contextmanager
def track_ai_call(operation: str, model: str, prompt_chars: int = 0):
    start = time.perf_counter()
    metrics = AICallMetrics(operation=operation, latency_ms=0, model=model, success=False, prompt_chars=prompt_chars)
    try:
        yield metrics
        metrics.success = True
    finally:
        metrics.latency_ms = round((time.perf_counter() - start) * 1000, 2)
        logger.info(
            "ai_call operation=%s model=%s latency_ms=%s success=%s prompt_chars=%s response_chars=%s",
            metrics.operation,
            metrics.model,
            metrics.latency_ms,
            metrics.success,
            metrics.prompt_chars,
            metrics.response_chars,
        )
