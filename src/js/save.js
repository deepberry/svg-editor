/**
 * @fileoverview save.js - Save the svg to the server
 * @license MIT
 */

/**
 * 初始化自动保存的状态
 */
const auto_save = localStorage.getItem("auto_save");
if (auto_save == "true") {
    $("#auto_save").attr("checked", "checked");

    // 初始化定时器，触发间隔30s
    const timer = setInterval(() => {
        $("#save_svg").click()
    }, 30000);
    sessionStorage.setItem("timer", timer);
}

$("#save_svg").click(function () {
    const token = sessionStorage.getItem("token");
    const dashboard_id = sessionStorage.getItem("dashboard_id");
    const svg = svgCanvas.getSvgString();
    const svgString = encodeURIComponent(svg);
    const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
    }
    const body = {
        "svg": svgString,
        "dashboard_id": dashboard_id,
    }

    this.disabled = true;
    this.innerText = "保存中...";

    fetch(`${API}/api/titan/overview/dashboard/map`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
    }).then(r => r.json()).then(r => {
        if (r.code == 0) {
            this.innerText = "保存成功";
            // 传递消息给另一个标签页 http://localhost:3800/overview/park/287
            const target = window.opener;
            target && target.postMessage("refresh", "*");
            
            setTimeout(() => {
                this.disabled = false;
                this.innerText = "保存";
            }, 2000);
        }
    })
});

$("#auto_save").click(function (e) {
    // input的值如果是true，那么初始化定时器，触发间隔30s
    if (this.checked) {
        const timer = setInterval(() => {
            $("#save_svg").click()
        }, 30000);
        sessionStorage.setItem("timer", timer);
    } else {
        // input的值如果是false，那么清除定时器
        const timer = sessionStorage.getItem("timer");
        clearInterval(timer);
        sessionStorage.removeItem("timer");
    }

    localStorage.setItem("auto_save", this.checked);
});