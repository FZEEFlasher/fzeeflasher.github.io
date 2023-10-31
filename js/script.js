let espStub;

const baudRates = 115200;

const bufferSize = 512;
const colors = ["#00a7e9", "#f89521", "#be1e2d"];
const measurementPeriodId = "0001";

const maxLogLength = 100;
const log = document.getElementById("log");
const butConnect = document.getElementById("butConnect");
const butClear = document.getElementById("butClear");
const butErase = document.getElementById("butErase");
const butProgram = document.getElementById("butProgram");
const autoscroll = document.getElementById("autoscroll");
const darkSS = document.getElementById("dark");
const lightSS = document.getElementById("light");
const darkMode = document.getElementById("darkmode");
const modelSelect = document.getElementById("modelSelect");
const versionSelect = document.getElementById("versionSelect");
const variantSelect = document.getElementById("variantSelect");
const offsets = [0x1000, 0x8000, 0xE000, 0x10000];
// Previous Marauder for ESP32-S2
const Mpreviouss2Files = {
    'bootloader': 'resources/S2/core/esp32_marauder.ino.bootloader.bin',
    'partitions': 'resources/S2/core/esp32_marauder.ino.partitions.bin',
    'boot_app0': 'resources/S2/core/boot_app0.bin',
    'firmware': 'resources/S2/marauder/previous/esp32_marauder_v0_13_2_20231018_flipper_sd_serial.bin',
};
// Latest Marauder for ESP32-S2
const Mlatests2Files = {
    'bootloader': 'resources/S2/core/esp32_marauder.ino.bootloader.bin',
    'partitions': 'resources/S2/core/esp32_marauder.ino.partitions.bin',
    'boot_app0': 'resources/S2/core/boot_app0.bin',
    'firmware': 'resources/S2/marauder/latest/esp32_marauder_v0_13_3_20231026_flipper_sd_serial.bin',
};
// Previous DualBoot for ESP32-S2
const DBpreviouss2Files = {
    'bootloader': 'resources/S2/core/esp32_marauder.ino.bootloader.bin',
    'partitions': 'resources/S2/core/esp32_marauder.ino.partitions.bin',
    'boot_app0': 'resources/S2/core/boot_app0.bin',
    'firmware': 'resources/S2/dualboot/previous/esp32_marauder_v0_13_2_20231018_flipper_sd_serial.bin',
};
// Latest DualBoot for ESP32-S2
const DBlatests2Files = {
    'bootloader': 'resources/S2/core/esp32_marauder.ino.bootloader.bin',
    'partitions': 'resources/S2/core/esp32_marauder.ino.partitions.bin',
    'boot_app0': 'resources/S2/core/boot_app0.bin',
    'firmware': 'resources/S2/dualboot/latest/esp32_marauder_v0_13_3_20231026_flipper_sd_serial.bin',
};
// Previous EvilPortal for ESP32-S2
const Epreviouss2Files = {
    'bootloader': 'resources/S2/evilportal/latest/EvilPortal.ino.bootloader.bin',
    'partitions': 'resources/S2/evilportal/latest/EvilPortal.ino.partitions.bin',
    'boot_app0': 'resources/S2/evilportal/latest/boot_app0.bin',
    'firmware': 'resources/S2/evilportal/latest/EvilPortal.ino.bin',
};
// Latest EvilPortal for ESP32-S2
const Elatests2Files = {
    'bootloader': 'resources/S2/evilportal/latest/EvilPortal.ino.bootloader.bin',
    'partitions': 'resources/S2/evilportal/latest/EvilPortal.ino.partitions.bin',
    'boot_app0': 'resources/S2/evilportal/latest/boot_app0.bin',
    'firmware': 'resources/S2/evilportal/latest/EvilPortal.ino.bin',
};
// Previous Marauder for ESP32-WROOM
const MpreviouswroomFiles = {
    'bootloader': 'resources/WROOM/core/esp32_marauder.ino.bootloader.bin',
    'partitions': 'resources/WROOM/core/esp32_marauder.ino.partitions.bin',
    'boot_app0': 'resources/WROOM/core/boot_app0.bin',
    'firmware': 'resources/WROOM/marauder/previous/esp32_marauder_v0_13_2_20231018_old_hardware.bin',
};
// Latest Marauder for ESP32-WROOM
const MlatestwroomFiles = {
    'bootloader': 'resources/WROOM/core/esp32_marauder.ino.bootloader.bin',
    'partitions': 'resources/WROOM/core/esp32_marauder.ino.partitions.bin',
    'boot_app0': 'resources/WROOM/core/boot_app0.bin',
    'firmware': 'resources/WROOM/marauder/latest/esp32_marauder_v0_13_3_20231026_old_hardware.bin',
};
// Previous EvilPortal for ESP32-WROOM
const EpreviouswroomFiles = {
    'bootloader': 'resources/WROOM/evilportal/latest/EvilPortal.ino.bootloader.bin',
    'partitions': 'resources/WROOM/evilportal/latest/EvilPortal.ino.partitions.bin',
    'boot_app0': 'resources/WROOM/evilportal/latest/boot_app0.bin',
    'firmware': 'resources/WROOM/evilportal/latest/EvilPortal.ino.bin',
};
// Latest EvilPortal for ESP32-WROOM
const ElatestwroomFiles = {
    'bootloader': 'resources/WROOM/evilportal/latest/EvilPortal.ino.bootloader.bin',
    'partitions': 'resources/WROOM/evilportal/latest/EvilPortal.ino.partitions.bin',
    'boot_app0': 'resources/WROOM/evilportal/latest/boot_app0.bin',
    'firmware': 'resources/WROOM/evilportal/latest/EvilPortal.ino.bin',
};
// Example unused syntax
const otherModelFiles = {
    'bootloader': 'resources/esp32_marauder.ino.bootloader.bin',
    'partitions': 'resources/esp32_marauder.ino.partitions.bin',
    'boot_app0': 'resources/boot_app0.bin',
    'firmware': 'resources/esp32_marauder_v0_13_3_20231026_flipper_sd_serial.bin',
};
const appDiv = document.getElementById("app");

document.addEventListener("DOMContentLoaded", () => {
    butConnect.addEventListener("click", () => {
        clickConnect().catch(async (e) => {
            console.error(e);
            errorMsg(e.message || e);
            if (espStub) {
                await espStub.disconnect();
            }
            toggleUIConnected(false);
        });
    });
    butClear.addEventListener("click", clickClear);
    butErase.addEventListener("click", clickErase);
    butProgram.addEventListener("click", clickProgram);
    autoscroll.addEventListener("click", clickAutoscroll);
    darkMode.addEventListener("change", clickDarkMode);
    window.addEventListener("error", function (event) {
        console.log("Got an uncaught error: ", event.error);
    });
    if ("serial" in navigator) {
        const notSupported = document.getElementById("notSupported");
        notSupported.classList.add("hidden");
    }
    modelSelect.addEventListener("change", () => {
        const selectedModel = modelSelect.value;
        // Handle model change if needed
    });

    versionSelect.addEventListener("change", () => {
        const selectedVersion = versionSelect.value;
        // Handle version change if needed
    });

    variantSelect.addEventListener("change", () => {
        const selectedVarient = variantSelect.value;
        // Handle varient change if needed
    });
    modelSelect.addEventListener("change", checkDropdowns);
    versionSelect.addEventListener("change", checkDropdowns);
    variantSelect.addEventListener("change", checkDropdowns);

    function checkDropdowns() {
        const isAnyDropdownNull = [modelSelect.value, versionSelect.value, variantSelect.value].includes("NULL");

        if (isAnyDropdownNull) {
            butProgram.disabled = true;
        } else {
            butProgram.disabled = false;
        }
    }
    checkDropdowns();
    loadAllSettings();
    updateTheme();
    logMsg("ESP Web Flasher loaded.");
});

function logMsg(text) {
    log.innerHTML += text + "<br>";

    if (log.textContent.split("\n").length > maxLogLength + 1) {
        let logLines = log.innerHTML.replace(/(\n)/gm, "").split("<br>");
        log.innerHTML = logLines.splice(-maxLogLength).join("<br>\n");
    }

    if (autoscroll.checked) {
        log.scrollTop = log.scrollHeight;
    }
}

function annMsg(text) {
    log.innerHTML += `<font color='#FF8200'>` + text + `<br></font>`;

    if (log.textContent.split("\n").length > maxLogLength + 1) {
        let logLines = log.innerHTML.replace(/(\n)/gm, "").split("<br>");
        log.innerHTML = logLines.splice(-maxLogLength).join("<br>\n");
    }

    if (autoscroll.checked) {
        log.scrollTop = log.scrollHeight;
    }
}
function compMsg(text) {
    log.innerHTML += `<font color='#2ED832'>` + text + `<br></font>`;

    if (log.textContent.split("\n").length > maxLogLength + 1) {
        let logLines = log.innerHTML.replace(/(\n)/gm, "").split("<br>");
        log.innerHTML = logLines.splice(-maxLogLength).join("<br>\n");
    }

    if (autoscroll.checked) {
        log.scrollTop = log.scrollHeight;
    }
}
function initMsg(text) {
    log.innerHTML += `<font color='#F72408'>` + text + `<br></font>`;

    if (log.textContent.split("\n").length > maxLogLength + 1) {
        let logLines = log.innerHTML.replace(/(\n)/gm, "").split("<br>");
        log.innerHTML = logLines.splice(-maxLogLength).join("<br>\n");
    }

    if (autoscroll.checked) {
        log.scrollTop = log.scrollHeight;
    }
}

function debugMsg(...args) {
    function getStackTrace() {
        let stack = new Error().stack;
        stack = stack.split("\n").map((v) => v.trim());
        stack.shift();
        stack.shift();

        let trace = [];
        for (let line of stack) {
            line = line.replace("at ", "");
            trace.push({
                func: line.substr(0, line.indexOf("(") - 1),
                pos: line.substring(line.indexOf(".js:") + 4, line.lastIndexOf(":")),
            });
        }

        return trace;
    }

    let stack = getStackTrace();
    stack.shift();
    let top = stack.shift();
    let prefix =
        '<span class="debug-function">[' + top.func + ":" + top.pos + "]</span> ";
    for (let arg of args) {
        if (typeof arg == "string") {
            logMsg(prefix + arg);
        } else if (typeof arg == "number") {
            logMsg(prefix + arg);
        } else if (typeof arg == "boolean") {
            logMsg(prefix + (arg ? "true" : "false"));
        } else if (Array.isArray(arg)) {
            logMsg(prefix + "[" + arg.map((value) => toHex(value)).join(", ") + "]");
        } else if (typeof arg == "object" && arg instanceof Uint8Array) {
            logMsg(
                prefix +
                "[" +
                Array.from(arg)
                    .map((value) => toHex(value))
                    .join(", ") +
                "]"
            );
        } else {
            logMsg(prefix + "Unhandled type of argument:" + typeof arg);
            console.log(arg);
        }
        prefix = "";
    }
}

function errorMsg(text) {
    logMsg('<span class="error-message">Error:</span> ' + text);
    console.log(text);
}

function updateTheme() {
    const selectedStyleSheet = darkMode.checked ? darkSS : lightSS;
    document.querySelectorAll("link[rel=stylesheet].alternate").forEach((styleSheet) => {
        enableStyleSheet(styleSheet, styleSheet === selectedStyleSheet);
    });
    saveSetting("darkmode", darkMode.checked);
}

function enableStyleSheet(node, enabled) {
    node.disabled = !enabled;
}

function formatMacAddr(macAddr) {
    return macAddr
        .map((value) => value.toString(16).toUpperCase().padStart(2, "0"))
        .join(":");
}

async function clickConnect() {
    if (espStub) {
        await espStub.disconnect();
        await espStub.port.close();
        toggleUIConnected(false);
        espStub = undefined;
        return;
    }

    const esploaderMod = await window.esptoolPackage;

    const esploader = await esploaderMod.connect({
        log: (...args) => logMsg(...args),
        debug: (...args) => debugMsg(...args),
        error: (...args) => errorMsg(...args),
    });
    try {
        await esploader.initialize();

        logMsg("Connected to " + esploader.chipName);
        logMsg("MAC Address: " + formatMacAddr(esploader.macAddr()));

        espStub = await esploader.runStub();
        toggleUIConnected(true);
        toggleUIToolbar(true);
        espStub.addEventListener("disconnect", () => {
            toggleUIConnected(false);
            espStub = false;
        });
    } catch (err) {
        await esploader.disconnect();
        throw err;
    }
}

async function changeBaudRate() {
    saveSetting("baudrate", baudRate.value);
    if (espStub) {
        let baud = parseInt(baudRate.value);
        if (baudRates.includes(baud)) {
            await espStub.setBaudrate(baud);
        }
    }
}

async function clickAutoscroll() {
    saveSetting("autoscroll", autoscroll.checked);
}

async function clickDarkMode() {
    updateTheme();
    saveSetting("darkmode", darkMode.checked);
}

async function clickErase() {
    if (window.confirm("This will erase the entire flash. Click OK to continue.")) {
        butErase.disabled = true;
        butProgram.disabled = true;
        try {
            logMsg("Erasing flash memory. Please wait...");
            let stamp = Date.now();
            await espStub.eraseFlash();
            logMsg("Finished. Took " + (Date.now() - stamp) + "ms to erase.");
        } catch (e) {
            errorMsg(e);
        } finally {

            butProgram.disabled = false;
        }
    }
}
async function clickProgram() {
    const readUploadedFileAsArrayBuffer = (inputFile) => {
        const reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.onerror = () => {
                reader.abort();
                reject(new DOMException("Problem parsing input file."));
            };

            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsArrayBuffer(inputFile);
        });
    };
    const selectedModel = modelSelect.value;
    const selectedVersion = versionSelect.value;
    const selectedVariant = variantSelect.value;

    function checkDropdowns() {
        const isAnyDropdownNull = [selectedModel, selectedVersion, selectedVariant].includes("NULL");

        if (isAnyDropdownNull) {
            butProgram.disabled = true;
        } else {
            butProgram.disabled = false;
        }
    }

    checkDropdowns();

    let selectedFiles;

    if (selectedModel === "S2") {
        selectedFiles = selectedVersion === "latest" ? 
            (selectedVariant === "Marauder" ? Mlatests2Files : (selectedVariant === "DB" ? DBlatests2Files : Elatests2Files)) 
            : (selectedVariant === "Marauder" ? Mpreviouss2Files : (selectedVariant === "DB" ? DBpreviouss2Files : Epreviouss2Files));
    } else if (selectedModel === "WROOM") {
        selectedFiles = selectedVersion === "latest" ? 
            (selectedVariant === "Marauder" ? MlatestwroomFiles : (selectedVariant === "DB" ? DBlatestwroomFiles : ElatestwroomFiles)) 
            : (selectedVariant === "Marauder" ? MpreviouswroomFiles : (selectedVariant === "DB" ? DBpreviouswroomFiles : EpreviouswroomFiles));
    }
    const flashMessages = document.getElementById("flashMessages");
    flashMessages.style.display = "block";

    butErase.disabled = true;
    butProgram.disabled = true;

    const fileTypes = ['bootloader', 'partitions', 'boot_app0', 'firmware'];
    initMsg(` `);
    initMsg(` !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! `);
    initMsg(` !!!&nbsp;&nbsp; FLASHING STARTED! DO NOT UNPLUG &nbsp;!!! `);
    initMsg(` !!!&nbsp;&nbsp;&nbsp;&nbsp; UNTIL FLASHING IS COMPLETE!! &nbsp;&nbsp;!!! `);
    initMsg(` !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! `);
    initMsg(` `);
    const flashingMessages = document.getElementById("flashMessages");
    flashingMessages.innerHTML = "";

    for (let fileType of fileTypes) {
        let fileResource = selectedFiles[fileType];

        try {
            let offset = [0x1000, 0x8000, 0xE000, 0x10000][fileTypes.indexOf(fileType)];
            const message = `<b><center><u>DO NOT TURN OFF OR UNPLUG YOUR BOARD!!</b></u> &nbsp;&nbsp;Flashing ${ucWords(fileType)}...</center>`;
            flashingMessages.innerHTML += `<div>${message}</div>`;
            annMsg(` ---> Flashing ${fileType}.`);
            let binfile = new File([await fetch(fileResource).then(r => r.blob())], fileType + ".bin");
            let contents = await readUploadedFileAsArrayBuffer(binfile);

            await espStub.flashData(
                contents,
                () => {
                    "100%";
                },
                offset
            );
            annMsg(` ---> Finished flashing ${fileType}.`);
            annMsg(` `);
            flashingMessages.lastElementChild.remove();

            await sleep(100);
        } catch (e) {
            errorMsg(e);
        }
    }

    // Re-enable the erase and program buttons
    butErase.disabled = false;
    butProgram.disabled = false;
    flashMessages.style.display = "none";
    compMsg(" ---> FLASHING PROCESS COMPLETED!");
    compMsg(" ");
    logMsg("Restart the board or disconnect to use the device.");
}

async function clickClear() {
    reset();
}

function convertJSON(chunk) {
    try {
        let jsonObj = JSON.parse(chunk);
        return jsonObj;
    } catch (e) {
        return chunk;
    }
}

function toggleUIToolbar(show) {
    isConnected = show;
    if (show) {
        appDiv.classList.add("connected");
    } else {
        appDiv.classList.remove("connected");
    }
    butErase.disabled = !show;
}

function toggleUIConnected(connected) {
    let lbl = "Connect";
    if (connected) {
        lbl = "Disconnect";
    } else {
        toggleUIToolbar(false);
    }
    butConnect.textContent = lbl;
}

function loadAllSettings() {
    autoscroll.checked = loadSetting("autoscroll", true);
    darkMode.checked = loadSetting("darkmode", true);
}

function loadSetting(setting, defaultValue) {
    let value = JSON.parse(window.localStorage.getItem(setting));
    if (value == null) {
        return defaultValue;
    }

    return value;
}

function saveSetting(setting, value) {
    window.localStorage.setItem(setting, JSON.stringify(value));
}

function ucWords(text) {
    return text
        .replace("_", " ")
        .toLowerCase()
        .replace(/(?<= )[^\s]|^./g, (a) => a.toUpperCase());
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
