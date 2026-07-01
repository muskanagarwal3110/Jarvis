import os
from dotenv import load_dotenv
load_dotenv()
from langchain.tools import tool
import requests
@tool
def multiply(a: int, b: int) -> int:
    """
    Multiply two integers.

    Args:
        a (int): The first integer.
        b (int): The second integer.

    Returns:
        int: The product of a and b.
    """
    return a * b

@tool
def add(a: int, b: int) -> int:
    """
    Add two integers.

    Args:
        a (int): The first integer.
        b (int): The second integer.

    Returns:
        int: The sum of a and b.
    """
    return a + b

@tool
def currency_converter(from_curr: str, to_curr: str, value: float)->float:
    """
    Convert value from one currency to another using Alpha Vantage API.

    Falls back to raising RuntimeError if API key is missing or request fails.
    """
    api_key = os.getenv('ALPHAVANTAGE_API_KEY')
    if not api_key:
        raise RuntimeError('ALPHAVANTAGE_API_KEY not set in environment')

    url = 'https://www.alphavantage.co/query'
    params = {
        'function': 'CURRENCY_EXCHANGE_RATE',
        'from_currency': from_curr,
        'to_currency': to_curr,
        'apikey': api_key,
    }
    resp = requests.get(url, params=params, timeout=10)
    resp.raise_for_status()
    data = resp.json()
    try:
        rate = data['Realtime Currency Exchange Rate']['5. Exchange Rate']
    except Exception as e:
        raise RuntimeError(f'Failed to get exchange rate: {data}') from e
    return value * float(rate)