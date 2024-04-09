// Initialize the dashboard with data and set up initial plots
function initDashboard() {
    fetchData().then(setupDashboard);
}

// Fetch data from the JSON file
function fetchData() {
    return d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json");
}

// Set up the dashboard with dropdown and initial charts
function setupDashboard(data) {
    console.log("Data:", data);
    populateDropdown(data.names);
    const initialSample = data.names[0];
    refreshCharts(initialSample, data);
}

// Populate the dropdown with test subject IDs
function populateDropdown(names) {
    let dropdown = d3.select("#selDataset");
    names.forEach(name => dropdown.append("option").text(name).property("value", name));
}

// Refresh the charts and metadata display for the selected sample
function refreshCharts(sample, data) {
    let sampleData = data.samples.filter(s => s.id == sample)[0];
    let metadata = data.metadata.find(m => m.id == parseInt(sample));
    
    updateBarChart(sampleData);
    updateBubbleChart(sampleData);
    displayMetadata(metadata);
}

// Update the bar chart with new sample data
function updateBarChart(sampleData) {
    let trace = createBarTrace(sampleData);
    let layout = { title: "Top 10 OTUs Found", margin: { t: 30, l: 150 } };
    Plotly.newPlot("bar", [trace], layout);
}

// Update the bubble chart with new sample data
function updateBubbleChart(sampleData) {
    let trace = createBubbleTrace(sampleData);
    let layout = {
        title: 'Bacteria Cultures Per Sample',
        showlegend: false,
        hovermode: 'closest',
        xaxis: { title: "OTU ID" },
        margin: { t: 30 }
    };
    Plotly.newPlot("bubble", [trace], layout);
}

// Display metadata for the selected sample
function displayMetadata(metadata) {
    let panel = d3.select("#sample-metadata").html("");
    if (metadata) {
        Object.entries(metadata).forEach(([key, value]) => {
            panel.append("div").text(`${key}: ${value}`);
        });
    } else {
        panel.append("h6").text("No metadata found.");
    }
}

// Create bar trace for the bar chart
function createBarTrace({ sample_values, otu_ids, otu_labels }) {
    return {
        x: sample_values.slice(0, 10).reverse(),
        y: otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
    };
}

// Create bubble trace for the bubble chart
function createBubbleTrace({ otu_ids, sample_values, otu_labels }) {
    return {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Earth"
        }
    };
}

// Handle changes in the dropdown
function onSampleChange(newSample) {
    fetchData().then(data => refreshCharts(newSample, data));
}

// Start the dashboard
initDashboard();
