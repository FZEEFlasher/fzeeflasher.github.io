document.addEventListener('DOMContentLoaded', () => {
    const connectButton = document.getElementById('butConnect');
    const disconnectButton = document.getElementById('butDisconnect');
    const baudRateSelect = document.getElementById('baudRate');
    const terminalContainer = document.getElementById('terminalContainer');
    const sendButton = document.getElementById('butSend');
    const inputField = document.getElementById('terminalInput');
    const statusDisplay = document.createElement('div');
    const textDecoder = new TextDecoder();
    const textEncoder = new TextEncoder(); 
    terminalContainer.appendChild(statusDisplay);

    let port;
    let writer;
    let globalReader = null;

    async function updateStatus(message) {
        statusDisplay.textContent = message; 
    }

    async function connect() {
        if ('serial' in navigator) {
            updateStatus("Serial is supported by navigator.");
            if (port) {
                updateStatus("Port is already open. Please disconnect before trying to connect again.");
                return; 
            }
            try {
                port = await navigator.serial.requestPort();
                const baudRate = getBaudRate(); 
                await port.open({ baudRate });
    
                await port.setSignals({ dataTerminalReady: true, requestToSend: true });
                device_connected = true;
                readLoop();
                updateStatus("Connected successfully.");
                disconnectButton.disabled = false;
                connectButton.disabled = true;
            } catch (err) {
                updateStatus(`Error accessing the serial port: ${err}`);
            }
        } else {
            updateStatus('Web Serial API not supported by your browser.');
        }
    }
    
    function getBaudRate() {
        let baudRate = document.getElementById('baudRate').value;
        if (baudRate === "custom") {
            baudRate = document.getElementById('baudRateCustom').value;
        }
        return parseInt(baudRate, 10) || 9600;
    }

    async function readLoop() {
        while (port.readable && device_connected) {
            reader = port.readable.getReader();
            try {
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) {
                        break;
                    }
                    const textChunk = textDecoder.decode(value);
                    displayData(textChunk);
                }
            } catch (error) {
                console.error('Read error: ' + error);
                updateStatus('Read error: ' + error);
                disconnect();
            } finally {
                reader.releaseLock();
            }
        }
        if (port) {
            await port.close();
            port = null;
            updateStatus("Disconnected.");
        }
    }

    function displayData(data) {
        const filteredData = data.replace(/\u0007/g, '');
    
        let outputContainer = document.querySelector('.terminal-output');
        let pre = outputContainer.querySelector('pre');
        if (!pre) {
            pre = document.createElement('pre');
            outputContainer.appendChild(pre);
        }
        pre.textContent += filteredData;
        outputContainer.scrollTop = outputContainer.scrollHeight;
    }

    async function send(data = '') {
        if (!port || !port.writable) {
            console.error('The port is not writable or not connected.');
            updateStatus('The port is not writable or not connected.');
            return;
        }

        const writer = port.writable.getWriter();

        try {
            const sendData = typeof data === 'string' ? textEncoder.encode(data + '\r\n') : data;
            await writer.write(sendData);
            updateStatus(`Data sent: ${data}`);
        } catch (error) {
            console.error('Write error:', error);
            updateStatus(`Write error: ${error}`);
        } finally {
            writer.releaseLock();
        }
    }

    inputField.addEventListener('keydown', async (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            send(inputField.value);
            inputField.value = '';
        } else if (event.ctrlKey && event.key === 'c') {
            event.preventDefault();
            send(new Uint8Array([3]));
        } else if (event.ctrlKey && event.key === 'd') {
            event.preventDefault();
            send(new Uint8Array([4]));
        }
    });
    
    async function disconnect() {
        if (port) {
            if (reader) {
                await reader.cancel();
                await reader.releaseLock();
            }
            if (writer) {
                await writer.close();
                await writer.releaseLock();
            }
            await port.close();
            port = null;
            device_connected = false;
            updateStatus("Disconnected.");
            connectButton.disabled = false;
            disconnectButton.disabled = true;
        }
    }

    connectButton.addEventListener('click', connect);
    sendButton.addEventListener('click', send);
    disconnectButton.addEventListener('click', disconnect);
    updateStatus("Ready to connect. Please select a baud rate and press 'Connect'.");
});