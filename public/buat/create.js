/**
 * Created by Jacob Strieb
 * May 2020
 */



/*******************************************************************************
 * Helper Functions
 ******************************************************************************/

// Highlight the text in an input with a given id
function highlight(id) {
  let output = document.querySelector("#" + id);
  output.focus();
  output.select()
  output.setSelectionRange(0, output.value.length + 1);
  return output;
}


// Validate all inputs, and display an error if necessary
function validateInputs() {
  var inputs = document.querySelectorAll(".form .labeled-input input");
  for (let i = 0; i < inputs.length; i++) {
    let input = inputs[i];
    input.reportValidity = input.reportValidity || (() => true);
    if (!input.reportValidity()) {
      return false;
    }
  }

  // Extra check for older browsers for URL input. Not sure if necessary, since
  // older browsers without built-in HTML5 validation may fail elsewhere.
  const url = document.querySelector("#url");
  let urlObj;
  try {
    urlObj = new URL(url.value);
  } catch {
    if (!("reportValidity" in url)) {
        alert("URL tidak valid. Pastikan URL diawali dengan 'http://' atau "
          + "'https://'.");
    }
    return false;
  }

  // Check for non-HTTP protocols; blocks them to prevent XSS attacks. Also
  // allow magnet links for password-protected torrents.
  if (!(urlObj.protocol == "http:"
        || urlObj.protocol == "https:"
        || urlObj.protocol == "magnet:")) {
    url.setCustomValidity("Link menggunakan protokol non-hyperteks yang tidak "
      + "diizinkan. URL diawali dengan " + urlObj.protocol + " dan mungkin "
      + "berbahaya.");
    url.reportValidity();
    return false;
  }

  return true;
}


// Perform encryption based on parameters, and return a base64-encoded JSON
// object containing all of the relevant data for use in the URL fragment.
async function generateFragment(url, passwd, hint, useRandomSalt, useRandomIv) {
  const api = apiVersions[LATEST_API_VERSION];

  const salt = useRandomSalt ? await api.randomSalt() : null;
  const iv = useRandomIv ? await api.randomIv() : null;
  const encrypted = await api.encrypt(url, passwd, salt, iv);
  const output = {
    v: LATEST_API_VERSION,
    e: b64.binaryToBase64(new Uint8Array(encrypted))
  }

  // Add the hint if there is one
  if (hint != "") {
    output["h"] = hint;
  }

  // Add the salt and/or initialization vector if randomly generated
  if (useRandomSalt) {
    output["s"] = b64.binaryToBase64(salt);
  }
  if (useRandomIv) {
    output["i"] = b64.binaryToBase64(iv);
  }

  // Return the base64-encoded output
  return b64.encode(JSON.stringify(output));
}



/*******************************************************************************
 * Main UI Functions
 ******************************************************************************/

function setupPasswordFields() {
  document.querySelectorAll(".password-field").forEach((field) => {
    const input = field.querySelector("input[type='password'], input[type='text']");
    const toggle = field.querySelector(".password-toggle");
    if (!input || !toggle || toggle.dataset.ready) return;

    toggle.dataset.ready = "true";
    toggle.addEventListener("click", () => {
      const isVisible = input.type === "text";
      input.type = isVisible ? "password" : "text";
      toggle.setAttribute("aria-label", isVisible ? "Tampilkan kata sandi" : "Sembunyikan kata sandi");
      toggle.title = isVisible ? "Tampilkan kata sandi" : "Sembunyikan kata sandi";
    });
  });

}

window.addEventListener("DOMContentLoaded", setupPasswordFields);

// Activated when the "Encrypt" button is pressed
async function onEncrypt() {
  if (!validateInputs()) {
    return;
  }

  // Check that password is successfully confirmed
  const password = document.querySelector("#password").value;
  const confirmPassword = document.querySelector("#confirm-password")
  const confirmation = confirmPassword.value;
  if (password != confirmation) {
    confirmPassword.setCustomValidity("Kata sandi tidak cocok");
    confirmPassword.reportValidity();
    return;
  }

  // Initialize values for encryption
  const url = document.querySelector("#url").value;
  const useRandomIv = document.querySelector("#iv").checked;
  const useRandomSalt = document.querySelector("#salt").checked;

  const hint = document.querySelector("#hint").value

  const encrypted = await generateFragment(url, password, hint, useRandomSalt,
      useRandomIv);
  const output = `https://byrai.my.id/jaga-link/#${encrypted}`;

  document.querySelector("#output").value = output;
  document.querySelector("#output").dataset.longUrl = output;
  document.querySelector("#shorten").disabled = false;
  document.querySelector(".shortener-alert").textContent = "";
  highlight("output");

  // Adjust "Hidden Bookmark" link
  document.querySelector("#bookmark").href = `https://byrai.my.id/sembunyi/#${encrypted}`;

  // Adjust "Open in New Tab" link
  document.querySelector("#open").href = output;

  // Adjust "Get TinyURL" button
  // document.querySelector("#tinyurl").value = output;

  // Scroll to the bottom so the user sees where the bookmark was created
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
}

async function onShorten() {
  const output = document.querySelector("#output");
  const shortenerAlert = document.querySelector(".shortener-alert");
  const longUrl = output.dataset.longUrl || output.value;
  const alias = document.querySelector("#custom-alias").value.trim();
  const params = new URLSearchParams({ format: "simple", url: longUrl });

  if (alias) {
    params.set("shorturl", alias);
  }

  shortenerAlert.textContent = "Memendekkan URL...";
  document.querySelector("#shorten").disabled = true;

  try {
    let response = await fetch(`https://is.gd/create.php?${params}`);
    let shortUrl = (await response.text()).trim();

    if (alias && (!response.ok || !shortUrl.startsWith("https://is.gd/"))) {
      const fallbackParams = new URLSearchParams({ format: "simple", url: longUrl });
      response = await fetch(`https://is.gd/create.php?${fallbackParams}`);
      shortUrl = (await response.text()).trim();
      shortenerAlert.textContent = "Alias tidak tersedia, jadi URL pendek biasa dibuat.";
    }

    if (!response.ok || !shortUrl.startsWith("https://is.gd/")) {
      throw new Error("URL pendek tidak berhasil dibuat.");
    }

    output.value = shortUrl;
    document.querySelector("#open").href = shortUrl;
    if (!shortenerAlert.textContent.includes("Alias")) {
      shortenerAlert.textContent = "URL pendek berhasil dibuat.";
    }
  } catch (error) {
    shortenerAlert.textContent = "URL gagal dipendekkan. Coba lagi.";
    console.error("Short URL error:", error);
  } finally {
    document.querySelector("#shorten").disabled = false;
  }
}


// Activated when the "Copy" button is pressed
function onCopy(id) {
  // Select and copy
  const output = highlight(id);
  document.execCommand("copy");

  // Alert the user that the text was successfully copied
  const alertArea = document.querySelector(".alert");
  alertArea.innerText = "Disalin";
  alertArea.style.opacity = "1";
  setTimeout(() => { alertArea.style.opacity = 0; }, 3000);

  // Deselect
  output.selectionEnd = output.selectionStart;
  output.blur();
}


// Activated when a user tries to disable randomization of the IV -- adds a
// scary warning that will frighten off anyone with common sense, unless they
// desperately need the URL to be a few characters shorter.
function onIvCheck(checkbox) {
  if (!checkbox.checked) {
    checkbox.checked = !confirm("Nonaktifkan pengacakan vektor inisialisasi "
      + "hanya jika Anda memahami risikonya. Menonaktifkan fitur ini "
      + "mengurangi keamanan link terenkripsi dan hanya menghemat 20-25 "
      + "karakter pada URL.\n\nTekan \"Batal\" kecuali Anda benar-benar "
      + "yakin dengan tindakan ini.");
  }
}
