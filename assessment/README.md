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

