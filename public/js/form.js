import { getDrinkById, createDrink, updateDrink } from "./api.js";
import { loadUserStatus } from "./auth.js";

const drinkForm = document.querySelector("#drinkForm");
const formTitle = document.querySelector("#formTitle");
const formSubtitle = document.querySelector("#formSubtitle");
const formMessage = document.querySelector("#formMessage");
const submitButton = document.querySelector("#submitButton");

const params = new URLSearchParams(window.location.search);
const drinkId = params.get("id");

function showMessage(message, type = "error") {
  formMessage.textContent = message;
  formMessage.className = `message ${type}`;
  formMessage.hidden = false;
}

function clearMessage() {
  formMessage.hidden = true;
  formMessage.textContent = "";
  formMessage.className = "message";
}

function isoToLocalDateTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

function localDateTimeToIso(value) {
  if (!value) return null;
  return new Date(value).toISOString();
}

function getPayloadFromForm() {
  const formData = new FormData(drinkForm);

  const payload = {
    brand: formData.get("brand")?.trim(),
    drinkName: formData.get("drinkName")?.trim(),
    sizeOz: Number(formData.get("sizeOz")),
    notes: formData.get("notes")?.trim() || "",
  };

  const caffeineMg = formData.get("caffeineMg");
  const sugarG = formData.get("sugarG");
  const rating = formData.get("rating");
  const purchasedAt = formData.get("purchasedAt");

  if (caffeineMg !== "") payload.caffeineMg = Number(caffeineMg);
  if (sugarG !== "") payload.sugarG = Number(sugarG);
  if (rating !== "") payload.rating = Number(rating);
  if (purchasedAt !== "") payload.purchasedAt = localDateTimeToIso(purchasedAt);

  return payload;
}

function fillForm(drink) {
  drinkForm.brand.value = drink.brand || "";
  drinkForm.drinkName.value = drink.drinkName || "";
  drinkForm.sizeOz.value = drink.sizeOz ?? "";
  drinkForm.caffeineMg.value = drink.caffeineMg ?? "";
  drinkForm.sugarG.value = drink.sugarG ?? "";
  drinkForm.rating.value = drink.rating ?? "";
  drinkForm.notes.value = drink.notes || "";
  drinkForm.purchasedAt.value = isoToLocalDateTime(drink.purchasedAt);
}

async function loadEditMode() {
  if (!drinkId) return;

  formTitle.textContent = "Edit Drink";
  formSubtitle.textContent = "Update an existing drink entry.";
  submitButton.textContent = "Update Drink";

  try {
    const drink = await getDrinkById(drinkId);
    fillForm(drink);
  } catch (error) {
    showMessage(error.message || "Failed to load drink.");
  }
}

drinkForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearMessage();

  const originalText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = drinkId ? "Updating..." : "Saving...";

  try {
    const payload = getPayloadFromForm();

    if (drinkId) {
      await updateDrink(drinkId, payload);
      showMessage("Drink updated successfully.", "success");
    } else {
      await createDrink(payload);
      showMessage("Drink created successfully.", "success");
      drinkForm.reset();
    }

    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 700);
  } catch (error) {
    showMessage(error.message || "Failed to save drink.");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalText;
  }
});

await loadUserStatus(null);
await loadEditMode();