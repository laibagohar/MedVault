import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import "../css/ReportTrends.css";

const API_URL = "http://localhost:5000/api/reports";

function groupReportsByType(reports) {
  const grouped = {};
  reports.forEach((report) => {
    if (!grouped[report.reportType]) grouped[report.reportType] = [];
    grouped[report.reportType].push(report);
  });
  return grouped;
}

function getAllTestNames(reports) {
  // Collect all unique test names for this report type
  const testNames = new Set();
  reports.forEach((report) => {
    if (report.testResults) {
      Object.keys(report.testResults).forEach((test) => testNames.add(test));
    }
  });
  return Array.from(testNames);
}

function getLatestCompletedReport(reports) {
  // Return the latest completed report (by reportDate)
  return (
    reports
      .filter((r) => r.status === "completed")
      .sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate))[0] || null
  );
}

function ReportTrends() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const token = localStorage.getItem('token');

  fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      let reportList = [];
      if (Array.isArray(data.data)) {
        reportList = data.data.map((d) => d.report || d);
      } else if (data.data?.report) {
        reportList = [data.data.report];
      } else if (data.data?.reports) {
        reportList = data.data.reports;
      }

      reportList = reportList.filter((r) => r.reportType && r.reportDate);
      setReports(reportList);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Error fetching reports:", err);
      setReports([]);
      setLoading(false);
    });
}, []);


  if (loading) return <div className="report-trends-loading">Loading...</div>;
  if (!reports.length)
    return <div className="report-trends-empty">No reports found.</div>;

  const grouped = groupReportsByType(reports);

  return (
    <div className="report-trends-wrapper">
      <h1>Report Trends</h1>
      {Object.entries(grouped).map(([reportType, typeReports]) => {
        // Sort by date ascending
        const sortedReports = [...typeReports].sort(
          (a, b) => new Date(a.reportDate) - new Date(b.reportDate)
        );
        const testNames = getAllTestNames(sortedReports);
        const latestCompleted = getLatestCompletedReport(sortedReports);

        return (
          <div className="report-type-section" key={reportType}>
            <h2>{reportType} Trends</h2>
            <div className="report-charts">
              {testNames.map((test) => {
                const dataPoints = sortedReports.map((report) =>
                  report.testResults?.[test]?.value ?? null
                );
                const labels = sortedReports.map((report) =>
                  new Date(report.reportDate).toLocaleDateString()
                );
                // Try to get normalRange from latest completed report
                const normalRange =
                  latestCompleted?.testResults?.[test]?.normalRange || null;

                // If all dataPoints are null, skip chart
                if (dataPoints.every((v) => v === null)) return null;

                // For Diabetes, normalRange may be an object with named ranges
                let extraNormalLines = [];
                if (
                  normalRange &&
                  typeof normalRange === "object" &&
                  !("min" in normalRange && "max" in normalRange)
                ) {
                  // e.g., { normal: "< 5.7", preDiabetes: "5.7 - 6.4", diabetes: "≥ 6.5" }
                  extraNormalLines = Object.entries(normalRange).map(([label, rangeText]) => {
  let numericValue = null;

  if (typeof rangeText === "string") {
    const match = rangeText.match(/[\d.]+/g); // Extract all numbers from the string

    if (match) {
      if (label === "normal") {
        numericValue = parseFloat(match[match.length - 1]); // Use upper end for "normal"
      } else if (label === "preDiabetes") {
        numericValue = (parseFloat(match[0]) + parseFloat(match[1])) / 2; // Use average for "preDiabetes"
      } else if (label === "diabetes") {
        numericValue = parseFloat(match[0]); // Use the lower bound
      }
    }
  }

  return numericValue
    ? {
        label,
        value: numericValue,
      }
    : null;
}).filter(Boolean); // Remove nulls

                }

                return (
                  <div className="report-chart-container" key={test}>
                    <h3>{test}</h3>
                    <Line
                      data={{
                        labels,
                        datasets: [
                          {
                            label: test,
                            data: dataPoints,
                            fill: false,
                            borderColor: "#007bff",
                            backgroundColor: "#007bff",
                            tension: 0.2,
                          },
                          ...(normalRange && normalRange.min && normalRange.max
                            ? [
                                {
                                  label: "Normal Min",
                                  data: Array(labels.length).fill(
                                    normalRange.min
                                  ),
                                  borderColor: "#28a745",
                                  borderDash: [5, 5],
                                  pointRadius: 0,
                                  fill: false,
                                },
                                {
                                  label: "Normal Max",
                                  data: Array(labels.length).fill(
                                    normalRange.max
                                  ),
                                  borderColor: "#dc3545",
                                  borderDash: [5, 5],
                                  pointRadius: 0,
                                  fill: false,
                                },
                              ]
                            : []),
                          ...extraNormalLines.map((line) => ({
  label: line.label,
  data: Array(labels.length).fill(line.value),
  borderColor:
    line.label === "normal"
      ? "#28a745"
      : line.label === "preDiabetes"
      ? "#ffc107"
      : "#dc3545",
  borderDash: [5, 5],
  pointRadius: 0,
  fill: false,
})),

                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { display: true, position: "top" },
                          title: { display: false },
                        },
                        scales: {
                          y: {
                            beginAtZero: false,
                          },
                        },
                      }}
                    />
                  </div>
                );
              })}
            </div>
            {latestCompleted?.recommendations && (
              <div className="report-recommendations">
                <h3>Recommendations & Advice</h3>
                {latestCompleted.recommendations.overall && (
                  <div>
                    <b>Overall Status:</b> {latestCompleted.recommendations.overall}
                  </div>
                )}
                {latestCompleted.recommendations.severity && (
                  <div>
                    <b>Severity:</b> {latestCompleted.recommendations.severity}
                  </div>
                )}
                {latestCompleted.recommendations.abnormalTests?.length > 0 && (
                  <div>
                    <b>Abnormal Tests:</b>
                    <ul>
                      {latestCompleted.recommendations.abnormalTests.map((t, i) => (
                        <li key={i}>
                          {t.testName}: {t.value} {t.unit} ({t.severity}) -{" "}
                          {t.interpretation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {latestCompleted.recommendations.recommendations?.length > 0 && (
                  <div>
                    <b>Medical Recommendations:</b>
                    <ul>
                      {latestCompleted.recommendations.recommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {latestCompleted.recommendations.lifestyle?.length > 0 && (
                  <div>
                    <b>Lifestyle Advice:</b>
                    <ul>
                      {latestCompleted.recommendations.lifestyle.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {latestCompleted.recommendations.medicalAdvice?.length > 0 && (
                  <div>
                    <b>Medical Advice:</b>
                    <ul>
                      {latestCompleted.recommendations.medicalAdvice.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {latestCompleted.recommendations.followUp?.length > 0 && (
                  <div>
                    <b>Follow Up:</b>
                    <ul>
                      {latestCompleted.recommendations.followUp.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ReportTrends;