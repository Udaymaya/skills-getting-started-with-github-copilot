from fastapi import status


def test_root_redirect(client):
    # Arrange & Act (don't follow the redirect automatically)
    response = client.get("/", follow_redirects=False)

    # Assert redirect to static index.html
    assert response.status_code == status.HTTP_307_TEMPORARY_REDIRECT
    assert response.headers["location"].endswith("/static/index.html")


def test_get_activities(client):
    # Act
    response = client.get("/activities")

    # Assert successful retrieval of activities data
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, dict)
    assert "Chess Club" in data
