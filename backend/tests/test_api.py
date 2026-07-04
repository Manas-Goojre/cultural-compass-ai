def test_health_ok(client):
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] in {"ok", "degraded"}


def test_plan_endpoint_returns_itinerary(client):
    res = client.post("/api/travel/plan", json={"destination": "Kyoto", "days": 1, "travelers": 2})
    assert res.status_code == 200
    body = res.json()
    assert "itinerary" in body
    assert "budget" in body


def test_plan_endpoint_validates_body(client):
    res = client.post("/api/travel/plan", json={"days": 0})
    assert res.status_code == 422


def test_plan_endpoint_accepts_minimal_body(client):
    res = client.post("/api/travel/plan", json={})
    assert res.status_code == 200
