import pandas as pd

# Load datasets
df1 = pd.read_csv("datasets/raw/Crop Yeild Data.csv")
df2 = pd.read_csv("datasets/raw/crop_yield.csv")

print("\nDataset 1")
print(df1.head())

print("\nDataset 2")
print(df2.head())

print("\nDataset 1 Info")
print(df1.info())

print("\nDataset 2 Info")
print(df2.info())

print("\nDataset 1 Missing Values")
print(df1.isnull().sum())

print("\nDataset 2 Missing Values")
print(df2.isnull().sum())