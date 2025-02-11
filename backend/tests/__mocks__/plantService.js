export async function identifyAndAssessPlant(image) {
    return {
      plantName: "Mocked Aloe Vera",
      healthAssessment: [
        { name: "Healthy", probability: "100%" },
        { name: "Nutrient Deficiency", probability: "5%" }
      ],
    };
  }
  