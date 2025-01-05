$(document).ready(function () {
  const form = $("#login-form");

  form.on("submit", function (e) {
    e.preventDefault();
    const username = $("#username").val();
    const password = $("#password").val();

    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "OK") {
          localStorage.setItem("token", data.token);
          alert("Log in successful.");
          window.location.href = `/admin-section`;
        } else {
          alert("Invalid credentials.");
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
      });
  });
});
