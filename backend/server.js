// Required dependencies
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());

// Fetch API data
const fetchData = async () => {
    const url = "http://qa-gb.api.dynamatix.com:3100/api/applications/getApplicationById/67339ae56d5231c1a2c63639";
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching API data:", error);
        return null;
    }
};

// checklist rules
const checklistRules = [
    {
        name: "Valuation Fee Paid",
        evaluate: (data) => data.isValuationFeePaid === true,
    },
    {
        name: "UK Resident",
        evaluate: (data) => data.isUkResident === true,
    },
    {
        name: "Risk Rating Medium",
        evaluate: (data) => data.riskRating === "Medium",
    },
    {
        name: "LTV Below 60%",
        evaluate: (data) => {
            const ltv = (data.loanRequired / data.purchasePrice) * 100;
            return ltv < 60;
        },
    },
];

// Evaluate checklist
const evaluateChecklist = (data) => {
    return checklistRules.map((rule) => ({
        name: rule.name,
        status: rule.evaluate(data) ? "Passed" : "Failed",
    }));
};

app.get('/checklist', async (req, res) => {
    const apiData = await fetchData();
    if (!apiData) {
        return res.status(500).send("Failed to fetch data from API.");
    }

    const results = evaluateChecklist(apiData);
    res.json(results);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});