from fuzzywuzzy import fuzz

class Finder:
    def __init__(self):
        self.threshold = 75
        self.priority_dict = dict([("end of security support", 50), ("product", -200), ("End-of-Sale Date", 80), ("end of vulnerability/security support", 500), ("final", 900), ("first", -900), ("release", -400), ("eos_date", 400), ("end of extended support", 40), ("extended end date", 60), ("end of mainstream support", 10), ("end of vulnerability", 50), ("End-of-Support (EOS) Date", 100), ("Last Time Order (LTO) Final, Non-Cancelable, Non-Returnable Order Due Date (Subject to lead time and availability)", -1000), ("deprecated", 100)])

    def find_eos_column(self, columns, eos_keywords):
        best_match = None
        highest_score = 0
        
        for column in columns:
            column_str = str(column)
            column_lower = column_str.lower()

            if column_lower == "supported":
                continue
            # print(f"\nEvaluating column: {column}")
            for keyword in eos_keywords:
                match_score = fuzz.partial_ratio(keyword.lower(), column_lower)
                # print(f"Keyword: {keyword}, Match score: {match_score}")
                if match_score >= self.threshold:
                    extra_score = 0
                    for p_keyword, p_priority in self.priority_dict.items():
                        p_match_score = fuzz.partial_ratio(p_keyword.lower(), column_lower)
                        if p_match_score >= self.threshold:
                            extra_score += p_priority
                            # print(f"Priority keyword: {p_keyword}, Priority score: {p_priority}, Partial match score: {p_match_score}, Accumulated extra score: {extra_score}")

                    total_score = match_score + extra_score
                    # print(f"Column: {column}, Match score: {match_score}, Extra score: {extra_score}, Total score: {total_score}")

                    if total_score > highest_score:
                        highest_score = total_score
                        best_match = column
                        # print(f"New best match: {best_match} with highest score: {highest_score}")
        
        return best_match
