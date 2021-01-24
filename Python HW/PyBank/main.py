import csv

csvpath = r"PyBank\Resources\budget_data.csv"
print(csvpath)

total_months = 0
total_profit = 0
is_first_row = True
prior_row_profit = 0
change_dict = {}

with open(csvpath, "r") as csvfile:
    csvreader = csv.reader(csvfile, delimiter=",")

    csv_header = next(csvreader)
    #print(f"CSV Header: {csv_header}")

    for row in csvreader:

        #row[0] = Date in month-year format ex: Jan-10
        #row[1] = Profit/Losses

        total_months += 1
        total_profit += int(row[1])

        if is_first_row:
            prior_row_profit = int(row[1])
            is_first_row = False
        else:
            change = int(row[1]) - prior_row_profit
            change_dict[row[0]] = change
            prior_row_profit = int(row[1])

    average_change = sum(change_dict.values()) / len(change_dict.values())
    greatest_increase = max(change_dict.values())
    greatest_increase_month = max(change_dict, key=change_dict.get)
    greatest_decrease = min(change_dict.values())
    greatest_decrease_month = min(change_dict, key=change_dict.get)


#print(total_months)
#print(total_profit)
#print(average_change)
# print(greatest_increase)
# print(greatest_decrease)
# print(greatest_increase_month)
# print(greatest_decrease_month)

summary = f"""Financial Analysis
----------------------------
Total Months: {total_months}
Total: ${total_profit}
Average Change: ${round(average_change,2)}
Greatest Increase in Profits: {greatest_increase_month} (${greatest_increase})
Greatest Decrease in Profits: {greatest_decrease_month} (${greatest_decrease})
"""

#Write a file and print the summary in terminal

print(summary)

with open("bank_results.txt", "w") as file1:
    file1.write(summary)