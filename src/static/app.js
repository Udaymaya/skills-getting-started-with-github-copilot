document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities", {cache: "no-store"});
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";
      // clear select (preserve placeholder option)
      activitySelect.innerHTML = "<option value=\"\">-- Select an activity --</option>";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;

        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
          <p><strong>Participants:</strong></p>
          ${
            details.participants.length
              ? `<ul class="participants-list">
                  ${details.participants
                    .map(
                      (p) =>
                        `<li data-participant="${p}">${p} <span class="remove-participant" title="Unregister">✖</span></li>`
                    )
                    .join("")}
                </ul>`
              : `<p class="info">None yet</p>`
          }
        `;

        activitiesList.appendChild(activityCard);

        // wire up delete handlers for participants
        activityCard.querySelectorAll('.remove-participant').forEach((span) => {
          span.addEventListener('click', async () => {
            const email = span.parentElement.getAttribute('data-participant');
            try {
              const resp = await fetch(
                `/activities/${encodeURIComponent(name)}/participants?email=${encodeURIComponent(email)}`,
                { method: 'DELETE' }
              );
              if (resp.ok) {
                messageDiv.textContent = (await resp.json()).message;
                messageDiv.className = 'success';
                fetchActivities();
              } else {
                const err = await resp.json();
                messageDiv.textContent = err.detail || 'Failed to remove participant';
                messageDiv.className = 'error';
              }
            } catch (e) {
              messageDiv.textContent = 'Error removing participant';
              messageDiv.className = 'error';
              console.error(e);
            }
            messageDiv.classList.remove('hidden');
            setTimeout(() => messageDiv.classList.add('hidden'), 5000);
          });
        });

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
        // refresh the activity list so new participant shows up
        fetchActivities();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
