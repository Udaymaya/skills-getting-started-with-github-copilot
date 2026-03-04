import copy
import pytest
from fastapi.testclient import TestClient

from src.app import app, activities


@pytest.fixture
def client():
    """Return a TestClient instance for the FastAPI app."""
    return TestClient(app)


@pytest.fixture(autouse=True)
def reset_activities():
    """Reset the global activities dictionary before and after each test.

    A deep copy of the original data is taken so mutable changes performed by a
    test don't leak into subsequent cases. The fixture yields control to the
    test and restores the state once the test completes.
    """
    original = copy.deepcopy(activities)
    yield
    activities.clear()
    activities.update(original)
