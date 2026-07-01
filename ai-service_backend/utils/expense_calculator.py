class Calculator:
    @staticmethod
    def multiply(a: float, b: float) -> float:
        """
        Multiply two numbers.
        Args:
            a (float): The first number.
            b (float): The second number.
        Returns:
            float: The product of a and b.
        """
        try:
            a = float(a)
            b = float(b)
        except (TypeError, ValueError) as e:
            raise ValueError(f"multiply expects two numbers, got a={a!r}, b={b!r}") from e
        return a * b

    @staticmethod
    def calculate_total(*x: float) -> float:
        """
        Calculate sum of the given list of numbers.
        Args:
            x (list): List of numbers.
        Returns:
            float: The sum of numbers in x.
        """
        try:
            nums = [float(n) for n in x]
        except (TypeError, ValueError) as e:
            raise ValueError(f"calculate_total expects numbers, got {x!r}") from e
        return sum(nums)

    @staticmethod
    def calculate_daily_budget(total: float, days: int) -> float:
        """
        Calculate daily budget.
        Args:
            total (float): Total cost.
            days (int): Total number of days.
        Returns:
            float: Expense for a single day.
        """
        try:
            total = float(total)
            days = int(days)
        except (TypeError, ValueError) as e:
            raise ValueError(f"calculate_daily_budget expects (total, days), got total={total!r}, days={days!r}") from e
        return total / days if days > 0 else 0