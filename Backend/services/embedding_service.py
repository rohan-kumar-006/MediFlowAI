import logging

import numpy as np

from backend.config import Settings, get_settings
from backend.utils import preprocess_text


logger = logging.getLogger(__name__)


class SymptomNormalizer:
    def __init__(self, settings: Settings | None = None) -> None:
        self.settings = settings or get_settings()
        self.terms = [
            "fever",
            "cold",
            "cough",
            "headache",
            "chest pain",
            "diabetes",
            "blood pressure",
            "asthma",
        ]
        self.model = None
        self.index = None
        if self.settings.enable_embeddings:
            self._initialize()

    @property
    def ready(self) -> bool:
        return self.model is not None and self.index is not None

    def _initialize(self) -> None:
        try:
            import faiss
            from sentence_transformers import SentenceTransformer

            self.model = SentenceTransformer(self.settings.embedding_model_name)
            self.index = faiss.IndexFlatL2(384)
            embeddings = self.model.encode(self.terms)
            self.index.add(np.array(embeddings, dtype="float32"))
            logger.info("Embedding normalizer initialized")
        except Exception:
            logger.exception("Embedding normalizer failed to initialize")
            self.model = None
            self.index = None

    def normalize(self, phrases: list[str]) -> list[dict[str, str | float]]:
        if not self.ready:
            raise RuntimeError("Embedding model is not initialized")

        results: list[dict[str, str | float]] = []
        for phrase in phrases:
            cleaned = preprocess_text(phrase)
            if not cleaned:
                continue
            embedding = self.model.encode([cleaned])
            distances, indices = self.index.search(np.array(embedding, dtype="float32"), 1)
            results.append(
                {
                    "original": phrase,
                    "cleaned": cleaned,
                    "matched_term": self.terms[int(indices[0][0])],
                    "score": float(distances[0][0]),
                }
            )
        return results
