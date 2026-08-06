def analyze_soil(N: float, P: float, K: float, pH: float):

    def nutrient_level(value):
        if value >= 70:
            return "High"
        elif value >= 40:
            return "Medium"
        else:
            return "Low"

    nitrogen = nutrient_level(N)
    phosphorus = nutrient_level(P)
    potassium = nutrient_level(K)

    if 6.5 <= pH <= 7.5:
        ph_status = "Neutral"
    elif pH < 6.5:
        ph_status = "Acidic"
    else:
        ph_status = "Alkaline"

    soil_score = round((N + P + K) / 3)

    if soil_score >= 70:
        quality = "Excellent"
    elif soil_score >= 50:
        quality = "Good"
    else:
        quality = "Poor"

    recommendations = []

    if nitrogen == "Low":
        recommendations.append("Increase nitrogen fertilizer.")

    if phosphorus == "Low":
        recommendations.append("Apply phosphorus-rich fertilizers.")

    if potassium == "Low":
        recommendations.append("Increase potassium supply.")

    if ph_status == "Acidic":
        recommendations.append("Apply lime to raise soil pH.")

    elif ph_status == "Alkaline":
        recommendations.append("Add organic matter to improve pH balance.")

    if not recommendations:
        recommendations.append("Soil conditions are suitable for cultivation.")

    return {
        "nitrogen": nitrogen,
        "phosphorus": phosphorus,
        "potassium": potassium,
        "ph": ph_status,
        "soil_score": soil_score,
        "quality": quality,
        "recommendation": " ".join(recommendations)
    }