document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("anomalyForm");

    const predictButton = document.getElementById("predictButton");
    const predictSpinner = document.getElementById("predictSpinner");

    const resultCard = document.getElementById("anomalyResult");
    const predictionStatus = document.getElementById("predictionStatus");
    const predictionConfidence = document.getElementById(
        "predictionConfidence"
    );

    const errorMessage = document.getElementById("anomalyError");
    const errorMessageText = document.getElementById(
        "anomalyErrorText"
    );

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Reset tampilan
        errorMessage.classList.add("d-none");
        resultCard.classList.add("d-none");

        // Ambil data dari form
        const data = {
            Reactor_Temp_C: parseFloat(
                document.getElementById("reactorTemp").value
            ),
            Jacket_Flow_Rate_L_min: parseFloat(
                document.getElementById("jacketFlow").value
            ),
            Pressure_atm: parseFloat(
                document.getElementById("pressure").value
            ),
            Reactant_A_Conc_mol_L: parseFloat(
                document.getElementById("reactantA").value
            ),
            Product_B_Conc_mol_L: parseFloat(
                document.getElementById("productB").value
            )
        };

        // Validasi input
        const hasInvalidValue = Object.values(data).some(
            value => Number.isNaN(value)
        );

        if (hasInvalidValue) {
            showError("Semua input harus diisi dengan angka yang valid.");
            return;
        }

        // Aktifkan loading
        predictButton.disabled = true;
        predictSpinner.classList.remove("d-none");

        try {
            const response = await fetch("/api/anomaly", {
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
                    "Terjadi kesalahan saat melakukan prediksi."
                );
            }

            // Tampilkan hasil prediksi
            predictionStatus.textContent =
                result.prediction ||
                result.status ||
                "Hasil tidak tersedia";

            // Tampilkan confidence jika tersedia
            if (result.confidence !== undefined) {
                predictionConfidence.textContent =
                    `Confidence: ${(result.confidence * 100).toFixed(2)}%`;
            } else {
                predictionConfidence.textContent = "";
            }

            resultCard.classList.remove("d-none");

        } catch (error) {
            showError(error.message);
        } finally {
            // Matikan loading
            predictButton.disabled = false;
            predictSpinner.classList.add("d-none");
        }
    });

    function showError(message) {
        errorMessageText.textContent = message;
        errorMessage.classList.remove("d-none");
    }
});