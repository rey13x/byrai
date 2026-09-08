function error(text) {
  document.querySelector(".form").style.display = "none";
  document.querySelector(".error").style.display = "inherit";
  document.querySelector("#errortext").innerText = `Kesalahan: ${text}`;
}

function setupPasswordFields() {
  document.querySelectorAll(".password-field").forEach((field) => {
    const input = field.querySelector("input[type='password'], input[type='text']");
    const toggle = field.querySelector(".password-toggle");
    if (!input || !toggle || toggle.dataset.ready) return;
    toggle.dataset.ready = "true";
    toggle.addEventListener("click", () => {
      const isVisible = input.type === "text";
      input.type = isVisible ? "password" : "text";
      toggle.classList.toggle("is-visible", !isVisible);
      toggle.setAttribute("aria-label", isVisible ? "Tampilkan kata sandi" : "Sembunyikan kata sandi");
      toggle.title = isVisible ? "Tampilkan kata sandi" : "Sembunyikan kata sandi";
    });
  });
}

// Run when the <body> loads
function main() {
  setupPasswordFields();
  if (window.location.hash) {
    document.querySelector(".form").style.display = "inherit";
    document.querySelector("#password").value = "";
    document.querySelector("#password").focus();
    document.querySelector(".error").style.display = "none";
    document.querySelector("#errortext").innerText = "";

    // Fail if the b64 library or API was not loaded
    if (!("b64" in window)) {
      error("Pustaka Base64 belum dimuat.");
      return;
    }
    if (!("apiVersions" in window)) {
      error("Pustaka API belum dimuat.");
      return;
    }

    // Try to get page data from the URL if possible
    const hash = window.location.hash.slice(1);
    let params;
    try {
      params = JSON.parse(b64.decode(hash));
    } catch {
      error("Link tampaknya rusak.");
      return;
    }

    // Check that all required parameters encoded in the URL are present
    if (!("v" in params && "e" in params)) {
      error("Link tampaknya rusak. URL terenkripsi tidak memiliki parameter yang diperlukan.");
      return;
    }

    // Check that the version in the parameters is valid
    if (!(params["v"] in apiVersions)) {
      error("Versi API tidak didukung. Link mungkin rusak.");
      return;
    }

    const api = apiVersions[params["v"]];

    // Get values for decryption
    const encrypted = b64.base64ToBinary(params["e"]);
    const salt = "s" in params ? b64.base64ToBinary(params["s"]) : null;
    const iv = "i" in params ? b64.base64ToBinary(params["i"]) : null;

    let hint, password;
    if ("h" in params) {
      hint = params["h"];
      document.querySelector("#hint").innerText = "Petunjuk: " + hint;
    }

    const unlockButton = document.querySelector("#unlockbutton");
    const passwordPrompt = document.querySelector("#password");
    passwordPrompt.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        unlockButton.click();
      }
    });
    unlockButton.addEventListener("click", async () => {
      password = passwordPrompt.value;

      // Decrypt and redirect if possible
      let url;
      try {
        url = await api.decrypt(encrypted, password, salt, iv);
      } catch {
        // Password is incorrect.
        error("Kata sandi salah.");

        // Set the "decrypt without redirect" URL appropriately
        document.querySelector("#no-redirect").href =
          `https://byrai.my.id/decrypt/#${hash}`;

        // Set the "create hidden bookmark" URL appropriately
        document.querySelector("#hidden").href =
          `https://byrai.my.id/sembunyi/#${hash}`;
        return;
      }

      try {
        // Extra check to make sure the URL is valid. Probably shouldn't fail.
        let urlObj = new URL(url);

        // Prevent XSS by making sure only HTTP URLs are used. Also allow magnet
        // links for password-protected torrents.
        if (!(urlObj.protocol == "http:"
              || urlObj.protocol == "https:"
              || urlObj.protocol == "magnet:")) {
            error(`Link menggunakan protokol non-hyperteks yang tidak diizinkan. `
              + `URL diawali dengan "${urlObj.protocol}" dan mungkin berbahaya.`);
          return;
        }

        // IMPORTANT NOTE: must use window.location.href instead of the (in my
        // opinion more proper) window.location.replace. If you use replace, it
        // causes Chrome to change the icon of a bookmarked link to update it to
        // the unlocked destination. This is dangerous information leakage.
        window.location.href = url;
      } catch {
        error("URL yang rusak telah dienkripsi. Tidak dapat mengalihkan halaman.");
        console.log(url);
        return;
      }
    });
  } else {
    // Otherwise redirect to the creator
    window.location.replace("/buat/");
  }
}
