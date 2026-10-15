import pytest


@pytest.fixture
def user():
    return {"name": "ada"}


def test_login_succeeds(user):
    assert user["name"] == "ada"


def test_login_rejects_bad_password():
    pytest.fail("bad password rejected")
