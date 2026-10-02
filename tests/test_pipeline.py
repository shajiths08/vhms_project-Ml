"""
Comprehensive Test Suite for Vehicle Health Monitoring ML Pipeline
Tests:
1. Healthy-like input
2. Warning-like input
3. Critical-like input
4. Boundary values
5. Invalid input error handling
"""
import os
import sys
import unittest
import json

# Include project root in python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ml.predict import evaluate_vehicle, predict_vehicle_health, calculate_vehicle_health_score, DEFAULT_PARAMETERS
from backend.app import app

class TestVehicleHealthPipeline(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = app.test_client()

    def test_01_healthy_like_input(self):
        """Test 1: Healthy-like input with nominal parameters."""
        healthy_input = {
            "vehicle_age": 1,
            "engine_temp": 86,
            "engine_rpm": 2000,
            "oil_level": 92,
            "oil_quality": 94,
            "battery_voltage": 12.7,
            "battery_health": 98,
            "tire_pressure": 32,
            "brake_condition": 95,
            "coolant_level": 95,
            "fuel_consumption": 17.0,
            "fuel_tank_level": 80,
            "air_filter_condition": 95,
            "transmission_temp": 84,
            "suspension_condition": 95,
            "vibration_level": 1.4,
            "exhaust_emission": 120,
            "previous_breakdowns": 0,
            "service_history": "Good"
        }
        res = evaluate_vehicle(healthy_input)
        print("\n[TEST 1 - Healthy Input Result]:", res["prediction"], f"(Confidence: {res['confidence']:.2f}, Score: {res['health_score']})")
        
        self.assertEqual(res["prediction"], "Healthy")
        self.assertGreaterEqual(res["health_score"], 80.0)
        self.assertEqual(len(res["risk_factors"]), 0)

    def test_02_warning_like_input(self):
        """Test 2: Warning-like input with moderate sensor deviations."""
        warning_input = {
            "vehicle_age": 6,
            "engine_temp": 104,
            "engine_rpm": 3200,
            "oil_level": 58,
            "oil_quality": 62,
            "battery_voltage": 12.1,
            "battery_health": 68,
            "tire_pressure": 28,
            "brake_condition": 62,
            "coolant_level": 62,
            "fuel_consumption": 13.5,
            "fuel_tank_level": 40,
            "air_filter_condition": 60,
            "transmission_temp": 103,
            "suspension_condition": 64,
            "vibration_level": 3.7,
            "exhaust_emission": 215,
            "previous_breakdowns": 2,
            "service_history": "Average"
        }
        res = evaluate_vehicle(warning_input)
        print("[TEST 2 - Warning Input Result]:", res["prediction"], f"(Confidence: {res['confidence']:.2f}, Score: {res['health_score']})")
        
        self.assertEqual(res["prediction"], "Warning")
        self.assertLess(res["health_score"], 80.0)
        self.assertGreater(len(res["risk_factors"]), 0)

    def test_03_critical_like_input(self):
        """Test 3: Critical-like input with severe multi-system failure indicators."""
        critical_input = {
            "vehicle_age": 9,
            "engine_temp": 120,
            "engine_rpm": 3900,
            "oil_level": 36,
            "oil_quality": 40,
            "battery_voltage": 11.4,
            "battery_health": 50,
            "tire_pressure": 26,
            "brake_condition": 40,
            "coolant_level": 45,
            "fuel_consumption": 10.0,
            "fuel_tank_level": 20,
            "air_filter_condition": 40,
            "transmission_temp": 115,
            "suspension_condition": 46,
            "vibration_level": 5.4,
            "exhaust_emission": 280,
            "previous_breakdowns": 5,
            "service_history": "Poor"
        }
        res = evaluate_vehicle(critical_input)
        print("[TEST 3 - Critical Input Result]:", res["prediction"], f"(Confidence: {res['confidence']:.2f}, Score: {res['health_score']})")
        
        self.assertEqual(res["prediction"], "Critical")
        self.assertLess(res["health_score"], 50.0)
        self.assertGreaterEqual(len(res["risk_factors"]), 3)

    def test_04_boundary_values(self):
        """Test 4: Extreme boundary inputs (minimums and maximums within physical limits)."""
        # Low boundaries
        low_boundary = {
            "vehicle_age": 0,
            "engine_temp": 70,
            "engine_rpm": 800,
            "oil_level": 100,
            "oil_quality": 100,
            "battery_voltage": 14.5,
            "battery_health": 100,
            "tire_pressure": 32,
            "brake_condition": 100,
            "coolant_level": 100,
            "fuel_consumption": 20.0,
            "fuel_tank_level": 100,
            "air_filter_condition": 100,
            "transmission_temp": 70,
            "suspension_condition": 100,
            "vibration_level": 0.5,
            "exhaust_emission": 50,
            "previous_breakdowns": 0,
            "service_history": "Good"
        }
        res_low = evaluate_vehicle(low_boundary)
        self.assertIn(res_low["prediction"], ["Healthy", "Warning", "Critical"])
        self.assertTrue(0.0 <= res_low["health_score"] <= 100.0)

        # High boundaries
        high_boundary = {
            "vehicle_age": 15,
            "engine_temp": 135,
            "engine_rpm": 5500,
            "oil_level": 10,
            "oil_quality": 10,
            "battery_voltage": 9.5,
            "battery_health": 20,
            "tire_pressure": 45,
            "brake_condition": 15,
            "coolant_level": 10,
            "fuel_consumption": 5.0,
            "fuel_tank_level": 5,
            "air_filter_condition": 10,
            "transmission_temp": 140,
            "suspension_condition": 15,
            "vibration_level": 12.0,
            "exhaust_emission": 800,
            "previous_breakdowns": 8,
            "service_history": "Poor"
        }
        res_high = evaluate_vehicle(high_boundary)
        self.assertIn(res_high["prediction"], ["Healthy", "Warning", "Critical"])
        self.assertTrue(0.0 <= res_high["health_score"] <= 100.0)
        print("[TEST 4 - Boundary Tests Passed]: Low Boundary Score =", res_low["health_score"], ", High Boundary Score =", res_high["health_score"])

    def test_05_invalid_input_error_handling(self):
        """Test 5: Handling invalid data types and corrupted requests."""
        # A: Non-numerical input in numeric field via API
        response = self.client.post('/api/predict', json={
            "engine_temp": "HOT_OVERHEATING_TEXT",
            "battery_voltage": "TWELVE_VOLTS"
        })
        self.assertEqual(response.status_code, 400)
        data = response.get_json()
        self.assertFalse(data["success"])
        self.assertIn("error", data)

        # B: Non-JSON payload
        response2 = self.client.post('/api/predict', data="not json")
        self.assertEqual(response2.status_code, 400)
        print("[TEST 5 - Invalid Input Handled Correctly]: HTTP 400 Bad Request returned with descriptive error.")

if __name__ == "__main__":
    unittest.main()
