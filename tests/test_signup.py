from fastapi import status

import src.app as app_module


def test_signup_happy_path(client):
    # Arrange
    activity = "Chess Club"
    email = "newstudent@mergington.edu"

    # Act
    response = client.post(
        f"/activities/{activity}/signup", params={"email": email}
    )

    # Assert
    assert response.status_code == status.HTTP_200_OK
    assert f"Signed up {email}" in response.json()["message"]
    assert email in app_module.activities[activity]["participants"]


def test_signup_nonexistent(client):
    response = client.post(
        "/activities/Nonexistent/signup", params={"email": "foo@bar.com"}
    )
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_signup_duplicate(client):
    activity = "Chess Club"
    email = "michael@mergington.edu"  # already participant in initial data
    response = client.post(
        f"/activities/{activity}/signup", params={"email": email}
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
