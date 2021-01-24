import csv

csvpath = r"PyPoll\Resources\election_data.csv"
print(csvpath)

total_votes = 0
candidate_dict = {}

with open(csvpath, "r") as csvfile:
    csvreader = csv.reader(csvfile, delimiter=",")

    csv_header = next(csvreader)
    
    #print(f'CSV Header: {csv_header}')

    for row in csvreader:

        # Column headers: Column 0 = Voter ID; Column 1 = County; Column 2 = Candidate

        # Counting total number of votes (the plus 1 is for the missing header)
        #total_votes = len(list(csvreader))+1
        #the above line worked, but it jacked up my other lines of code

        total_votes += 1
        
        # Compiling list of candidates that recieved votes; and the total number of votes each received
        candidate = row[2] 

        if candidate in candidate_dict.keys():
            candidate_dict[candidate] += 1
        else:
            candidate_dict[candidate] = 1

        # Calculate % of votes each candidate received

percent_dict = {}
for key in candidate_dict.keys():
    percent = candidate_dict[key] / total_votes
    percent_dict[key] = percent

        # Name the winner of the election

winner = max(candidate_dict, key=candidate_dict.get) 

        # Format the results to look like what they want

candidate_list_results = []

for key in percent_dict.keys():
    candidate_line = key + ": " + "{:.3%}".format(percent_dict[key]) + "% (" + str(candidate_dict[key]) + ")"
    candidate_list_results.append(candidate_line)

final_string = "\n".join(candidate_list_results)

#print(final_string)

summary = f"""Election Results
-------------------------
Total Votes: {total_votes}
-------------------------
{final_string}
-------------------------
Winner: {winner}
-------------------------"""

#Write a file and print the summary in terminal

print(summary)

with open("election_results_summary.txt", "w") as file1:
    file1.write(summary)
