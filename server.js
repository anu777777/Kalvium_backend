const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize an array to store operation history
const operationHistory = [];

// Middleware to parse URL parameters
app.use(express.urlencoded({ extended: true }));

// GET endpoint to list available endpoint samples
app.get('/', (req, res) => {
    const samples = [
        'GET /',
        'GET /history',
        'GET /5/plus/3',
        'GET /3/minus/5',
        'GET /3/minus/5/plus/8',
        'GET /3/into/5/plus/8/into/6'
    ];
    res.send('Available samples:\n' + samples.join('\n'));
});

// GET endpoint to retrieve history of last 20 operations
app.get('/history', (req, res) => {
    res.json(operationHistory.slice(-20).reverse());
});

// GET endpoint for performing calculations
app.get('/calculate/:num1/:operator/:num2', (req, res) => {
    const num1 = parseFloat(req.params.num1);
    const num2 = parseFloat(req.params.num2);
    const operator = req.params.operator;

    if (isNaN(num1) || isNaN(num2)) {
        res.status(400).json({ error: 'Invalid numbers' });
        return;
    }

    let result;
    let question;

    switch (operator) {
        case 'plus':
            result = num1 + num2;
            question = `${num1} + ${num2}`;
            break;
        case 'minus':
            result = num1 - num2;
            question = `${num1} - ${num2}`;
            break;
        case 'into':
            result = num1 * num2;
            question = `${num1} * ${num2}`;
            break;
        case 'divide':
            if (num2 === 0) {
                res.status(400).json({ error: 'Division by zero' });
                return;
            }
            result = num1 / num2;
            question = `${num1} / ${num2}`;
            break;
        default:
            res.status(400).json({ error: 'Invalid operator' });
            return;
    }

    const operation = { question, answer: result };
    //console.log(operation);
    operationHistory.push(operation);

    if (operationHistory.length > 20) {
        operationHistory.shift();
    }
    res.json(operation);
});

app.get('/calculate/:num1/:operator1/:num2/:operator2/:num3', (req, res) => {
    const num1 = parseFloat(req.params.num1);
    const num2 = parseFloat(req.params.num2);
    const num3 = parseFloat(req.params.num3);
    const operator1 = req.params.operator1;
    const operator2 = req.params.operator2;

    if (isNaN(num1) || isNaN(num2) || isNaN(num3)) {
        res.status(400).json({ error: 'Invalid numbers' });
        return;
    }

    let result;
    let question;

    switch (operator1) {
        case 'plus':
            result = num1 + num2;
            question = `${num1} + ${num2}`;
            break;
        case 'minus':
            result = num1 - num2;
            question = `${num1} - ${num2}`;
            break;
        case 'into':
            result = num1 * num2;
            question = `${num1} * ${num2}`;
            break;
        case 'divide':
            if (num2 === 0) {
                res.status(400).json({ error: 'Division by zero' });
                return;
            }
            result = num1 / num2;
            question = `${num1} / ${num2}`;
            break;
        default:
            res.status(400).json({ error: 'Invalid operator' });
            return;
    }

    switch (operator2) {
        case 'plus':
            result += num3;
            question += ` + ${num3}`;
            break;
        case 'minus':
            result -= num3;
            question += ` - ${num3}`;
            break;
        case 'into':
            result *= num3;
            question += ` * ${num3}`;
            break;
        case 'divide':
            if (num3 === 0) {
                res.status(400).json({ error: 'Division by zero' });
                return;
            }
            result /= num3;
            question += ` / ${num3}`;
            break;
        default:
            res.status(400).json({ error: 'Invalid operator' });
            return;
    }

    const operation = { question, answer: result };
    operationHistory.push(operation);

    if (operationHistory.length > 20) {
        operationHistory.shift();
    }

    res.json(operation);
});


app.get('/calculate/:num1/:operator1/:num2/:operator2/:num3/:operator3/:num4', (req, res) => {
    const num1 = parseFloat(req.params.num1);
    const num2 = parseFloat(req.params.num2);
    const num3 = parseFloat(req.params.num3);
    const num4 = parseFloat(req.params.num4);
    const operator1 = req.params.operator1;
    const operator2 = req.params.operator2;
    const operator3 = req.params.operator3;

    if (isNaN(num1) || isNaN(num2) || isNaN(num3) || isNaN(num4)) {
        res.status(400).json({ error: 'Invalid numbers' });
        return;
    }

    let result = num1;
    let question = `${num1}${operator1}${num2}${operator2}${num3}${operator3}${num4}`;

    const operators = ['+', '-', '*', '/'];

    const expression = question.replace(/ /g, '');

    // Split the expression by operators
    const values = expression.split(new RegExp(operators.map(op => '\\' + op).join('|'), 'g'));

    // Split the expression by values
    const operatorsUsed = expression.split(/[0-9]+/).filter(op => operators.includes(op));

    if (values.length !== operatorsUsed.length + 1) {
        res.status(400).json({ error: 'Invalid expression' });
        return;
    }

    result = parseFloat(values[0]);

    for (let i = 0; i < operatorsUsed.length; i++) {
        const right = parseFloat(values[i + 1]);

        switch (operatorsUsed[i]) {
            case '+':
                result += right;
                break;
            case '-':
                result -= right;
                break;
            case '*':
                result *= right;
                break;
            case '/':
                if (right === 0) {
                    res.status(400).json({ error: 'Division by zero' });
                    return;
                }
                result /= right;
                break;
        }
    }

    const operation = { question, answer: result };
    operationHistory.push(operation);

    if (operationHistory.length > 20) {
        operationHistory.shift();
    }

    res.json(operation);
});

// Other routes and server initialization here...




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
