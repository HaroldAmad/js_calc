const keys = document.querySelectorAll('.key');
const display_input = document.querySelector('.display .input');
const display_output = document.querySelector('.display .output');
let input = "";
let memory = null;

for (let key of keys) {
    const value = key.dataset.key;

    key.addEventListener('click', () => {
        if (value == "clear") {
            memory = 0; // Clear the memory
            input = "";
            display_input.innerHTML = "";
            display_output.innerHTML = "";
        } else if (value == "backspace") {
            input = input.slice(0, -1);
            display_input.innerHTML = CleanInput(input);
        } else if (value == "=") {
            let result = eval(PrepareInput(input));
            display_output.innerHTML = CleanOutput(result);
		} else if (value == "brackets") {
			if (
				input.indexOf("(") == -1 || 
				input.indexOf("(") != -1 && 
				input.indexOf(")") != -1 && 
				input.lastIndexOf("(") < input.lastIndexOf(")")
			) {
				input += "(";
			} else if (
				input.indexOf("(") != -1 && 
				input.indexOf(")") == -1 || 
				input.indexOf("(") != -1 &&
				input.indexOf(")") != -1 &&
				input.lastIndexOf("(") > input.lastIndexOf(")")
			) {
				input += ")";
			}
			display_input.innerHTML = CleanInput(input);
        } else if (value == "bin") {
            let binaryValue = convertToBinary(input);
            display_output.innerHTML = binaryValue;
        } else if (value == "m+") {
            if (memory === null || isNaN(memory)) {
                memory = 0;
            }
            memory += parseFloat(display_output.innerHTML);
            display_output.innerHTML = memory;
            input = "";
            display_input.innerHTML = "";
        } else if (value == "m-") {
            if (memory !== null && !isNaN(memory)) {
                let currentInput = parseFloat(display_output.innerHTML);
                let result = currentInput - memory;
                display_output.innerHTML = result;
                input = result.toString();
            }
        } else if (value == "mr") {
            if (memory !== null) {
                display_output.innerHTML = memory;
                input = memory.toString();
            }
        } else {
            if (ValidateInput(value)) {
                input += value;
                display_input.innerHTML = CleanInput(input);
            }
        }
    });
}
function CleanInput(input) {
    let input_array = input.split("");
    let input_array_length = input_array.length;

    for (let i = 0; i < input_array_length; i++) {
        if (input_array[i] == "*") {
            input_array[i] = ` <span class="operator">x</span> `;
        } else if (input_array[i] == "/") {
            input_array[i] = ` <span class="operator">÷</span> `;
        } else if (input_array[i] == "+") {
            input_array[i] = ` <span class="operator">+</span> `;
        } else if (input_array[i] == "-") {
            input_array[i] = ` <span class="operator">-</span> `;
        } else if (input_array[i] == "(") {
            input_array[i] = `<span class="brackets">(</span>`;
        } else if (input_array[i] == ")") {
            input_array[i] = `<span class="brackets">)</span>`;
        } else if (input_array[i] == "%") {
            input_array[i] = `<span class="percent">%</span>`;
        }
    }

    return input_array.join("");
}

function CleanOutput(output) {
    let output_string = output.toString();
    let decimal = output_string.split(".")[1];
    output_string = output_string.split(".")[0];

    let output_array = output_string.split("");

    if (output_array.length > 3) {
        for (let i = output_array.length - 3; i > 0; i -= 3) {
            output_array.splice(i, 0, ",");
        }
    }

    if (decimal) {
        output_array.push(".");
        output_array.push(decimal);
    }

    return output_array.join("");
}

function ValidateInput(value) {
    let last_input = input.slice(-1);
    let operators = ["+", "-", "*", "/"];

    if (value == "." && last_input == ".") {
        return false;
    }

    if (operators.includes(value)) {
        if (operators.includes(last_input)) {
            return false;
        } else {
            return true;
        }
    }

    return true;
}

function PrepareInput(input) {
    let input_array = input.split("");

    for (let i = 0; i < input_array.length; i++) {
        if (input_array[i] == "%") {
            input_array[i] = "/100";
        }
    }

    return input_array.join("");
}

function convertToBinary(input) {
    let decimalValue = parseFloat(input);
    if (isNaN(decimalValue)) {
        return "Invalid input";
    }

    let binaryValue = decimalToBinary(decimalValue, 8); // Specify the precision you want
    return binaryValue;
}

function decimalToBinary(decimalValue, k_prec) {
    let binary = "";

    let Integral = parseInt(decimalValue, 10);
    let fractional = decimalValue - Integral;

    while (Integral > 0) {
        let rem = Integral % 2;

        binary += String.fromCharCode(rem + '0'.charCodeAt());

        Integral = parseInt(Integral / 2, 10);
    }

    binary = reverse(binary);
    binary += ('.');

    while (k_prec-- > 0) {
        fractional *= 2;
        let fract_bit = parseInt(fractional, 10);

        if (fract_bit == 1) {
            fractional -= fract_bit;
            binary += String.fromCharCode(1 + '0'.charCodeAt());
        } else {
            binary += String.fromCharCode(0 + '0'.charCodeAt());
        }
    }

    return binary;
}

function reverse(input) {
    let temparray = input.split('');
    let left, right = 0;
    right = temparray.length - 1;

    for (left = 0; left < right; left++, right--) {
        let temp = temparray[left];
        temparray[left] = temparray[right];
        temparray[right] = temp;
    }

    return temparray.join("");
}

document.querySelector('[data-key="decimal-to-binary"]').addEventListener('click', () => {
    if (display_output.innerHTML) {
        let decimalValue = parseFloat(display_output.innerHTML.replace(/,/g, ''));
        let binaryValue = decimalToBinary(decimalValue, 8); // Specify the precision you want
        display_output.innerHTML = binaryValue;
    }
});
