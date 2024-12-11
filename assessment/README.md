## Getting the App Started
First add a file called .env.local to the assessment folder.

Copy the following and put it inside:

NEXT_PUBLIC_TOM_API_KEY=

NEXT_PUBLIC_MODEL_ID=

NEXT_PUBLIC_TOM_API_URL=

MONGODB_URI=

(Make the environment variables equal to the relevant values)

Next, run the following in the terminal:

cd assessment

After that, run the following in the terminal:

npm i

Next, run the development server:

npm run dev


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Note: I used a MondoDB atlas dabase to store user input and batch downloads.

## Functions of the App

The app's homepage offers the user the decision to select any of the TOM models.

After selecting a model, the user is taken to a page with a form that they can fill in for the selected model.
Submitting the user's information, returns a decision from the TOM api and this is also saved to a database together with the user input.

The user also has the option to use the batch upload feature on that page, with which they can upload a pipe-delimited csv file, which is then sent to the TOM API, after which they can download another pipe-delimited csv file with decisions made for all inputs. This file is also broken down into its individual entries with decisions, which are also saved to the database the moment the user presses the download button.

Lastly, there is a back button to go back to the home page for selecting another model.

