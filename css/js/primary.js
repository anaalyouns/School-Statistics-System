const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyA6K9vRkMIFQGl_BcxGNHUZHUYlfj3xayD_mNGMg12yEJAb0r0WCNdHIUpZN_W5_AF/exec";
// جميع حقول البنين والبنات
const boysInputs = document.querySelectorAll(".boys");
const girlsInputs = document.querySelectorAll(".girls");

// الإجماليات
const boysTotal = document.getElementById("boysTotal");
const girlsTotal = document.getElementById("girlsTotal");
const allTotal = document.getElementById("allTotal");
const messageBox = document.getElementById("messageBox");
const messageText = document.getElementById("messageText");
function showMessage(text,type){

messageText.textContent=text;

messageBox.className="message-box "+type;

messageBox.style.display="block";

setTimeout(()=>{

messageBox.style.display="none";

},3000);

}

// حساب الإجماليات
function calculateTotals() {

    let totalBoys = 0;
    let totalGirls = 0;

    boysInputs.forEach((boyInput, index) => {

        let boys = parseInt(boyInput.value) || 0;
        let girls = parseInt(girlsInputs[index].value) || 0;

        // إجمالي الصف
        boyInput.parentElement.parentElement.querySelector(".total").textContent = boys + girls;

        totalBoys += boys;
        totalGirls += girls;

    });

    boysTotal.textContent = totalBoys;
    girlsTotal.textContent = totalGirls;
    allTotal.textContent = totalBoys + totalGirls;

}

// عند كتابة أي رقم
boysInputs.forEach(input => {
    input.addEventListener("input", calculateTotals);
});

girlsInputs.forEach(input => {
    input.addEventListener("input", calculateTotals);
});
// ===============================
// زر تسجيل البيانات
// ===============================

document.getElementById("saveBtn").addEventListener("click", async function () {

    
    let inputs = document.querySelectorAll("input");

    let complete = true;

    inputs.forEach(input => {

        if (input.value.trim() === "") {

            input.style.border = "2px solid red";
            complete = false;

        } else {

            input.style.border = "1px solid #ccc";

        }

    });

    if (!complete) {

showMessage("⚠️ يرجى استكمال جميع البيانات","error");
        return;

    }
const saveBtn = document.getElementById("saveBtn");

    saveBtn.disabled = true;
    saveBtn.innerHTML = "⏳ جارٍ الإرسال...";
await sendToGoogleSheet();});//==============================
// نسبة اكتمال البيانات
//==============================

const progressBar = document.getElementById("progressBar");
const progressPercent = document.getElementById("progressPercent");

function updateProgress(){

    const inputs = document.querySelectorAll("input");

    let filled = 0;

    inputs.forEach(input=>{

        if(input.value.trim()!==""){
            filled++;
        }

    });

    const percent = Math.round((filled/inputs.length)*100);

    progressBar.style.width = percent + "%";

    progressPercent.textContent = percent + "%";

}

document.querySelectorAll("input").forEach(input=>{

    input.addEventListener("input",updateProgress);

});
// ==========================
// زر إعادة التعيين
// ==========================

document.getElementById("resetBtn").addEventListener("click", function () {

    if (!confirm("هل أنت متأكد من مسح جميع البيانات؟")) {
        return;
    }

    // مسح جميع الحقول
    document.querySelectorAll("input").forEach(input => {
        input.value = "";
        input.style.border = "1px solid #ccc";
    });

    // تصفير إجمالي كل صف
    document.querySelectorAll(".total").forEach(item => {
        item.textContent = "0";
    });

    // تصفير الإجماليات
    boysTotal.textContent = "0";
    girlsTotal.textContent = "0";
    allTotal.textContent = "0";

    // إعادة شريط التقدم
    progressBar.style.width = "0%";
    progressPercent.textContent = "0%";

    // إعادة حساب الإجماليات للتأكد
    calculateTotals();

    // رسالة نجاح
    showMessage("🧹 تم مسح جميع البيانات بنجاح", "success");
// إعادة تفعيل زر التسجيل
const saveBtn = document.getElementById("saveBtn");

saveBtn.disabled = false;
saveBtn.innerHTML = "💾 تسجيل البيانات";
saveBtn.style.background = "";
saveBtn.style.cursor = "pointer";
saveBtn.style.opacity = "1";
});
async function sendToGoogleSheet() {
    const saveBtn = document.getElementById("saveBtn");

    const boys = document.querySelectorAll(".boys");
    const girls = document.querySelectorAll(".girls");

    const data = {

        schoolName: document.getElementById("schoolName").value,

        principalName: document.getElementById("managerName").value,

        principalPhone: document.getElementById("managerPhone").value,

        vicePrincipalName: document.getElementById("assistantName").value,

        vicePrincipalPhone: document.getElementById("assistantPhone").value,

        grade1Boys: boys[0].value || 0,
        grade1Girls: girls[0].value || 0,

        grade2Boys: boys[1].value || 0,
        grade2Girls: girls[1].value || 0,

        grade3Boys: boys[2].value || 0,
        grade3Girls: girls[2].value || 0,

        grade4Boys: boys[3].value || 0,
        grade4Girls: girls[3].value || 0,

        grade5Boys: boys[4].value || 0,
        grade5Girls: girls[4].value || 0,

        grade6Boys: boys[5].value || 0,
        grade6Girls: girls[5].value || 0,

        totalBoys: boysTotal.textContent,

        totalGirls: girlsTotal.textContent,

        totalStudents: allTotal.textContent

    };

    try {

        const response = await fetch(SCRIPT_URL, {

            method: "POST",

            body: JSON.stringify(data)

        });

        const result = await response.json();

        if(result.result==="success"){

showMessage("✅ تم تسجيل البيانات بنجاح", "success");
  saveBtn.innerHTML = "✅ تم التسجيل";
saveBtn.disabled = true;
saveBtn.style.background = "#9e9e9e";
saveBtn.style.cursor = "not-allowed";
saveBtn.style.opacity = "0.7";

}

    } catch (error) {

        showMessage("❌ حدث خطأ أثناء الإرسال", "error");

    }

}

