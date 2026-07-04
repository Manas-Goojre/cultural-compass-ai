import pytest

from app.ai.response_validator import ResponseValidator


@pytest.fixture
def validator():
    return ResponseValidator()


def test_parses_plain_json(validator):
    data = validator.parse_json_response('{"a": 1, "b": "two"}')
    assert data == {"a": 1, "b": "two"}


def test_parses_fenced_json(validator):
    raw = "```json\n{\"a\": 1}\n```"
    assert validator.parse_json_response(raw) == {"a": 1}


def test_malformed_json_raises(validator):
    with pytest.raises(ValueError):
        validator.parse_json_response("not json at all")


def test_non_object_json_raises(validator):
    with pytest.raises(ValueError):
        validator.parse_json_response("[1, 2, 3]")


def test_ensure_fields_passes_when_present(validator):
    data = {"itinerary": [], "budget": {}}
    assert validator.ensure_fields(data, ["itinerary", "budget"]) is data


def test_ensure_fields_raises_on_missing(validator):
    with pytest.raises(ValueError) as exc:
        validator.ensure_fields({"itinerary": []}, ["itinerary", "budget"])
    assert "budget" in str(exc.value)


def test_attach_metadata(validator):
    data = validator.attach_metadata({}, model="gemini-2.5-flash", latency_ms=42.0)
    assert data["meta"]["model"] == "gemini-2.5-flash"
    assert data["meta"]["latency_ms"] == 42.0
