import { Button, Card, Spin } from "antd";
import "chart.js/auto";
import * as htmlToImage from "html-to-image";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import printerIcon from "../assets/icons/printer.svg";
import { IBaseResponse } from "../interfaces";
import { IGraphAPIResponse } from "../interfaces/pdfGraph.interface";
import services from "../services";

const DashBoard = () => {
  const [graphApiData, setGraphApiData] = useState<IGraphAPIResponse>();
  const [isPrintingPdf, setIsPrintingPdf] = useState<boolean>(false);
  const [isLoadingGraphData, setIsLoadingGraphData] = useState<boolean>(true);
  let yAxisLabel = "Arrests";

  // Register the linear scale
  const getGraphData = async () => {
    setIsLoadingGraphData(true);
    try {
      let graphDataResponse: IGraphAPIResponse = await services.getGraphData();
      setGraphApiData(graphDataResponse);
    } catch (err) {
      console.error(
        "Error getting graph data using the provided graph API:",
        err
      );
    }

    setIsLoadingGraphData(false);
  };

  const generatePdf = async () => {
    setIsPrintingPdf(true);
    try {
      var node = document.getElementById("chart");
      if (node)
        await htmlToImage
          .toPng(node)
          .then(async function (dataUrl) {
            var img = new Image();
            img.src = dataUrl;
            // Call the API to generate PDF here
            const generatedPdfResponse: IBaseResponse<{ pdfLink: string }> =
              await services.generatePdf(graphApiData, dataUrl);

            if (generatedPdfResponse.data?.pdfLink) {
              window.open(
                generatedPdfResponse.data?.pdfLink,
                "_blank",
                "noopener noreferrer"
              );

              // const link = document.createElement("a");
              // link.href = generatedPdfResponse.data?.pdfLink;
              // link.download = new Date().toDateString() + ".pdf";
              // link.click();
              // window.URL.revokeObjectURL(generatedPdfResponse.data?.pdfLink);
            }
          })
          .catch(function (error) {
            console.error("oops, something went wrong!", error);
          });
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
    setIsPrintingPdf(false);
  };

  useEffect(() => {
    getGraphData();
  }, []);

  let burglaryData = [
    0,
    ...(graphApiData?.data ? graphApiData?.data?.map((x) => x.Burglary)! : []),
  ];

  return (
    <div
      style={{
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        display: "flex",
      }}
    >
      <div
        style={{
          width: "100%",
        }}
      >
        <div id="chart">
          {!isLoadingGraphData ? (
            <div
              style={{
                width: "30%",
                background: "#F2F4F5",
                borderRadius: "12px",
              }}
            >
              <div
                style={{
                  background: "#E8EEFB",
                  boxShadow: "5rem",
                  color: "#1463FF",
                  padding: "0.6rem",
                  borderRadius:
                    "12px 12px 0 0" /* top-left, top-right, bottom-right, bottom-left */,
                }}
              >
                <p
                  style={{
                    fontFamily: "Poppins",
                    fontSize: "9px",
                  }}
                >
                  Burglary
                </p>
              </div>
              <div
                style={{
                  padding: "20px 20px 20px 0px",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <span className="rotate-270">{yAxisLabel}</span>
                <Card
                  style={{
                    height: "100%",
                    width: "100%",
                    boxShadow: "2px",
                    padding: 5,
                  }}
                >
                  <ReactApexChart
                    height={"100%"}
                    width={"100%"}
                    options={{
                      stroke: {
                        colors: ["#1463FF"],
                        width: 2,
                      },
                      chart: {
                        id: "basic-line",
                        toolbar: {
                          show: false,
                        },
                      },
                      yaxis: {
                        labels: {
                          style: {
                            fontFamily: "Poppins",
                            fontSize: "8px",
                            colors: ["#626E99"],
                          },
                        },
                        axisBorder: {
                          show: true,
                        },
                      },
                      xaxis: {
                        labels: {
                          style: {
                            fontFamily: "Poppins",
                            fontSize: "8px",
                            colors: ["#626E99"],
                          },
                        },
                        min: 0,
                        categories: [
                          ...(graphApiData?.data
                            ? graphApiData?.data?.map((x) => x.data_year)!
                            : []),
                        ],
                      },
                    }}
                    series={[
                      {
                        name: "Years",
                        data: burglaryData ?? [0],
                      },
                    ]}
                    type="line"
                  />
                </Card>
              </div>
            </div>
          ) : (
            <>
              <Spin size="large"></Spin>
            </>
          )}
        </div>
        <div
          style={{
            margin: "30px",
            display: "flex",
          }}
        >
          <Button
            style={{
              background: "#000000",
              color: "white",
            }}
            size="large"
            loading={isPrintingPdf}
            onClick={() => {
              generatePdf();
            }}
            disabled={isPrintingPdf || !graphApiData}
          >
            {!isPrintingPdf && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div>
                  <img
                    src={printerIcon}
                    style={{
                      height: "20px",
                      marginTop: "5px",
                    }}
                  />
                </div>
                <p
                  style={{
                    marginTop: "1px",
                    marginLeft: "5px",
                    fontSize: "10px",
                    fontFamily: "Poppins",
                  }}
                >
                  Print
                </p>
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
