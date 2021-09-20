document.addEventListener("DOMContentLoaded", function () {
  let forms = document.querySelectorAll("form");

  forms.forEach(function (form) {
    form
      .querySelector("button, input[type=button], input[type=submit]")
      .addEventListener("click", function () {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/roistat", true);
        // xhr.setRequestHeader('Content-type', 'text/html; charset=utf-8');

        var data = new FormData();
        var isValidData = true;

        form.querySelectorAll("input").forEach(function (input) {
          console.log();
          if (input.name == "phone" && !form.classList.contains('form-new-design')) {
            var phoneValue = input.value;
            var phoneValues = phoneValue.split(" ");

            if (phoneValue.trim().length < 13) {
              isValidData = false;
            }
            data.append(input.name, input.value.trim());
          }

          if (form.classList.contains('form-new-design') && input.name == "phone") {
            let iti = window.intlTelInputGlobals.getInstance(form.querySelector('input[name=phone]'))

            if (!iti.isValidNumber()) {
              isValidData = false;
            } else {
              isValidData = true;
            }

            data.append(input.name, iti.getNumber());
          }

        });

        let form_id = form.getAttribute("id");
        let form_name = "";
        let formNames = [
          { form_name: "headlineActiveBtnForm", form_id: "form-recall-green-btn" },
          { form_name: "headlineCallbackBtnForm", form_id: "form-recall-header-btn" },
          { form_name: "firstScreenProjectDownloadForm", form_id: "intro-form" },
          { form_name: "overviewForm", form_id: "form-download-pdf" },
          { form_name: "bankForm", form_id: "form-credit" },
          { form_name: "installmentForm", form_id: "form-vingroup" },
          { form_name: "mapForm", form_id: "form-toor" },
          { form_name: "footerForm", form_id: "form-recall-footer" },
          { form_name: "filterForm", form_id: "form-filter" },
          { form_name: "filterBookingForm", form_id: "form-recall" },
          { form_name: "formDownloadPdfNew", form_id: "form-pdf-new" },
          { form_name: "formBookJorney", form_id: "form-book" },
        ];

        formNames.forEach(function (row) {
          if (row.form_id == form_id) {
            return (form_name = row.form_name);
          }
        });

        data.append("title", window.location.hostname);
        data.append("form", form_name);

        data.append("comment", window.location.hostname + "\n" + form_name);

        if (isValidData) {
          xhr.send(data);
        } else {
          xhr.abort();
        }

        if (xhr.status != 200) {
          console.error("error");
        }
      });
  });
});
