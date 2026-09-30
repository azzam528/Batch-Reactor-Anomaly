document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("reactorForm");

    const recommendButton = document.getElementById("recommendButton");
    const recommendSpinner = document.getElementById("recommendSpinner");

    const resultCard = document.getElementById("reactorResult");
    const recommendationAction = document.getElementById(
        "recommendationAction"
    );
    const recommendationDescription = document.getElementById(
        "recommendationDescription"
    );

    const errorMessage = document.getElementById("reactorError");
    const errorMessageText = document.getElementById("reactorErrorText");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Sembunyikan hasil dan error sebelumnya
        errorMessage.classList.add("d-none");
        resultCard.classList.add("d-none");

        // Ambil nilai dari 5 state
        const data = {
            state_1: parseFloat(
                document.getElementById("state1").value
            ),
            state_2: parseFloat(
                document.getElementById("state2").value
            ),
            state_3: parseFloat(
                document.getElementById("state3").value
            ),
            state_4: parseFloat(
                document.getElementById("state4").value
            ),
            state_5: parseFloat(
                document.getElementById("state5").value
            )
        };

        // Validasi input
        const hasInvalidValue = Object.values(data).some(
            value => Number.isNaN(value)
        );

        if (hasInvalidValue) {
            showError("Semua state harus diisi dengan angka yang valid.");
            return;
        }

        // Aktifkan loading
        recommendButton.disabled = true;
        recommendSpinner.classList.remove("d-none");

        try {
            const response = await fetch("/api/reactor-control", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error ||
                    "Terjadi kesalahan saat mengambil rekomendasi."
                );
            }

            // Tampilkan action
            recommendationAction.textContent =
                result.action || "Rekomendasi tidak tersedia";

            // Tampilkan description jika tersedia
            recommendationDescription.textContent =
                result.description || "";

            // Tampilkan result card
            resultCard.classList.remove("d-none");

        } catch (error) {
            showError(error.message);
        } finally {
            // Matikan loading
            recommendButton.disabled = false;
            recommendSpinner.classList.add("d-none");
        }
    });

    function showError(message) {
        errorMessageText.textContent = message;
        errorMessage.classList.remove("d-none");
    }
});