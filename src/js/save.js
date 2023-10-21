/**
 * @fileoverview save.js - Save the svg to the server
 * @license MIT
 */

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

    console.log(body)
    
    fetch("http://localhost:10090/api/titan/dashboard/map", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
    }).then(r => r.json()).then(r => {
        console.log(r.code)
        if (r.code == 0) {
            alert("保存成功")

            // postMessage to other window
            // const win = window.opener;

        }
    })
});