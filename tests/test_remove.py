from fastapi import status

import src.app as app_module


def test_remove_happy_path(client):
    activity = "Chess Club"
    email = "michael@mergington.edu"
    response = client.delete(
        f"/activities/{activity}/participants", params={"email": email}
    )
    assert response.status_code == status.HTTP_200_OK
    assert email not in app_module.activities[activity]["participants"]


def test_remove_no_activity(client):
    response = client.delete(
        "/activities/Nope/participants", params={"email": "foo@bar.com"}
    )
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_remove_no_participant(client):
    activity = "Chess Club"
    email = "notpresent@mergington.edu"
    response = client.delete(
        f"/activities/{activity}/participants", params={"email": email}
    )
    assert response.status_code == status.HTTP_404_NOT_FOUND
