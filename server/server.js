const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const puppeteer = require('puppeteer');
//admin
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const serviceAccount = require("./classconnect-23c26-firebase-adminsdk-lv1vl-0d4850ffcc.json");
const path = require('path');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});



const db = admin.firestore();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../classconnect/classconnect/build')));
app.use("/", (req, res) => {
  res.send("Hello World");
});


app.post('/save-aims-data', async (req, res) => {
  try {
    const { uid, username, password, schoolYear, semester } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with bcrypt
    await db.collection('aims').doc(uid).set({
      username,
      password: hashedPassword,
      schoolYear,
      semester,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    });
    res.status(201).send('AIMS data saved successfully.');
  } catch (error) {
    res.status(500).send('Error saving AIMS data: ' + error.message);
  }
});


app.get('/fetch-last-updated/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const docRef = db.collection('aims').doc(uid);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).send('Document not found');
    }

    const { lastUpdated } = doc.data();
    const date = lastUpdated.toDate(); // Convert Firestore timestamp to Date object

    res.status(200).json({ lastUpdated: date });
  } catch (error) {
    console.error('Error fetching last updated:', error);
    res.status(500).send('Error fetching last updated');
  }
});

app.post('/update-last-updated', async (req, res) => {
  try {
    const { uid } = req.body;

    // Update lastUpdated field to the current timestamp
    await db.collection('aims').doc(uid).update({
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).send('Last updated field updated successfully.');
  } catch (error) {
    res.status(500).send('Error updating lastUpdated field: ' + error.message);
  }
});

app.get('/fetch-aims/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const docRef = db.collection('aims').doc(uid);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).send('Document not found');
    }

    const aimsData = doc.data();
    aimsData.lastUpdated = aimsData.lastUpdated.toDate(); // Convert Firestore timestamp to Date object
    res.status(200).json({ aimsData });
  } catch (error) {
    console.error('Error fetching aims document:', error);
    res.status(500).send('Error fetching aims document');
  }
});

app.post('/submitApplication', async (req, res) => {
  try {
    const { orgName, orgType, orgDescription, link, number, userId } = req.body;
    await db.collection('requests').doc(userId).set({
      orgName,
      orgType,
      orgDescription,
      link,
      number,
      userId,
      createdAt: new Date(),
      status: 'pending'
    });
    res.status(201).send('Application submitted successfully.');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/user-role/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const userDoc = await db.collection('users').doc(uid).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      const role = userData.role || 'user'; // Default role if not found
      res.status(200).json({ role });
    } else {
      res.status(404).send('User document not found');
    }
  } catch (error) {
    console.error('Error fetching user role:', error);
    res.status(500).send('Error fetching user role');
  }
});

app.get('/fetch-requests', async (req, res) => {
  try {
    const snapshot = await db.collection('requests').where('status', '==', 'pending').get();
    const requests = [];

    await Promise.all(snapshot.docs.map(async doc => {
      const requestData = doc.data();
      const userSnapshot = await db.collection('users').doc(requestData.userId).get();
      const userData = userSnapshot.data();
      requestData.displayName = userData.fullname;
      
      const createdAt = requestData.createdAt.toDate();
      requestData.createdAt = createdAt.toLocaleString();
      
      requests.push({ id: doc.id, ...requestData });
    }));
    
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.put('/requests/:id/decline', async (req, res) => {
  const requestId = req.params.id;

  try {
    // Update request status to 'declined' in Firestore
    await db.collection('requests').doc(requestId).update({ status: 'declined' });
    res.status(200).send('Request declined successfully.');
  } catch (error) {
    console.error('Error declining request:', error);
    res.status(500).send('Failed to decline request.');
  }
});

app.put('/requests/:id/accept', async (req, res) => {
  const requestId = req.params.id;

  try {
    // Update request status to 'accepted' in Firestore
    await db.collection('requests').doc(requestId).update({ status: 'accepted' });

    // Update user's role to 'organization' in Firestore
    const requestSnapshot = await db.collection('requests').doc(requestId).get();
    const userId = requestSnapshot.data().userId;
    await db.collection('users').doc(userId).update({ role: 'organization' });

    res.status(200).send('Request accepted successfully.');
  } catch (error) {
    console.error('Error accepting request:', error);
    res.status(500).send('Failed to accept request.');
  }
});

app.get('/fetch-schedules/:uid', async (req, res) => {
  const { uid } = req.params;

  try {
    const userDocRef = db.collection('users').doc(uid);
    const userDocSnapshot = await userDocRef.get();

    if (!userDocSnapshot.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = userDocSnapshot.data();
    const userClassSchedule = userData.class_schedule || [];
    const transformedSchedule = userClassSchedule.map((schedule, index) => ({
      title: schedule.title,
      start: schedule.start,
      end: schedule.end,
      description: schedule.description,
      day: schedule.day,
    }));

    res.status(200).json(transformedSchedule);
   
  } catch (error) {
    console.error('Error fetching class schedule:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// app.get('/fetch-events/:uid', async (req, res) => {
//   try {
//     const { uid } = req.params;

//     // Fetch the user's course and year
//     const userDoc = await db.collection('users').doc(uid).get();
//     if (!userDoc.exists) {
//       return res.status(404).send('User not found');
//     }
//     const userData = userDoc.data();
//     const userCourse = userData.course;
//     const userYear = userData.yearlvl;
//     console.log("User course and year:", userCourse, userYear);

//     // Fetch and filter events
//     const eventsCollectionRef = db.collection('events');
//     const eventsSnapshot = await eventsCollectionRef.get();
//     const eventsData = eventsSnapshot.docs
//       .map(doc => {
//         const data = doc.data();
//         return {
//           id: doc.id,
//           title: data.title,
//           start: moment(`${data.date} ${data.startTime}`).toDate(),
//           end: moment(`${data.date} ${data.endTime}`).toDate(),
//           location: data.location,
//           targetCourse: data.targetCourse,
//           targetYear: data.targetYear,
//           type: 'event'
//         };
//       })
//       .filter(event => event.targetCourse === userCourse && event.targetYear === userYear);
//       console.log("Events fetched:", eventsData);
//     res.status(200).json(eventsData);
//   } catch (error) {
//     console.error("Error fetching events:", error);
//     res.status(500).send("Error fetching events");
//   }
// });

app.post('/update-schedule', async (req, res) => {
  const { uid, newSchedule } = req.body;
  const userDocRef = db.collection('users').doc(uid);
 
  try {
    const doc = await userDocRef.get();
    if (!doc.exists) {
      return res.status(404).send('User not found.');
    }
    const userData = doc.data();
    const currentSchedule = userData.class_schedule;
    if (JSON.stringify(currentSchedule) === JSON.stringify(newSchedule)) {
      res.status(200).send("Class Schedule is up to date.");
    } else {
      await userDocRef.update({ class_schedule: newSchedule });
      res.status(200).send("Class schedule updated successfully.");
    }
  } catch (error) {
    console.error('Error updating class schedule:', error);
    res.status(500).send('Failed to update class schedule.');
  }
});
 
app.post('/fetch-schedule', async (req, res) => {
  const { username, password, schoolYear, semester } = req.body;
  try {
    const scheduleData = await runPuppeteer(username, password, schoolYear, semester);
    res.status(200).json(scheduleData);
  } catch (error) {
    res.status(500).json({ error: error.message });
    return;
  }
});


const runPuppeteer = async (username, password, schoolYear, semester) => {
  const browser = await puppeteer.launch({headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();
  await page.goto('https://cituweb.pinnacle.com.ph/aims/students/');
  await page.waitForSelector('.aims-textfield input[name="password"]');
  await page.type('.aims-textfield input[name="username"]', username);
  await page.type('.aims-textfield input[name="password"]', password);
  await page.click('button[type="submit"]');
  const invalidCredentials = await page.$('.aims-notification.error');
  console.log('Invalid credentials:', invalidCredentials);
  // await page.waitForSelector('.aims-notification.error', { timeout: 10000 });
  // console.log('Checking for invalid credentials...');
  if(invalidCredentials){
    await browser.close();
    console.log('Invalid credentials.');
    throw new Error('Invalid credentials. Please try again.');
  } else {
    console.log('Login successful.');
  }
  console.log('Navigating to schedule page...');
  await page.goto('https://cituweb.pinnacle.com.ph/aims/students/schedule.php?mainID=1&menuDesc=Schedule');
  await page.waitForSelector('.table.table-bordered.no-margin');
  await page.select('select[name="cboSY"]', schoolYear);
  await page.waitForSelector('select[name="cboSem"]');
  await page.select('select[name="cboSem"]', semester);
  await page.waitForSelector('.dbtable.table-bordered.table.table-hover');
  // This account is Applicant only
  // Invalid credentials.
  const scheduleData = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('.dbtable.table-bordered.table.table-hover tbody tr')); 
    const scheduleArray = [];

    rows.forEach(row => {
      const tds = Array.from(row.querySelectorAll('td.regu'));
      const rowData = tds.map(td => td.innerText.trim());
      scheduleArray.push(rowData);
    });
    return scheduleArray;
  });

  function convertTimeToISO(timeString) {
    const today = new Date();
    const timeFormat = /(\d+):(\d+)(AM|PM)/;
    const match = timeString.match(timeFormat);
    if (!match) {
        throw new Error('Invalid time format');
    }

    let [_, hourStr, minutesStr, period] = match;
    let hour = parseInt(hourStr);
    let minutes = parseInt(minutesStr);

    if (period === 'PM' && hour !== 12) {
        hour = (hour + 12) % 24;
    } else if (period === 'AM' && hour === 12) {
        hour = 0;
    } 
    // const singaporeHour = hour + 8;
    today.setHours(hour, minutes, 0);
    // today.setUTCHours(0); // Set UTC hours to ensure timezone offset is 0

    const isoString = today.toISOString(); // Append '000Z' to ensure UTC

    return isoString;
}

  function parseSchedule(rawText, title) {
    const daysMap = {
        'M': 'MON',
        'T': 'TUE',
        'W': 'WED',
        'TH': 'THU',
        'F': 'FRI',
        'SAT': 'SAT'
    };

    const regex = /([A-Z]\d+-[A-Z]{2}\d+)\s-\s(M|T|W|TH|F|SAT)\s?\/?\s?(M|T|W|TH|F|SAT)?\s(\d{2}:\d{2}(AM|PM))-(\d{2}:\d{2}(AM|PM))\s(\w+|\w+\d+)\s?\/?\s?(\d{2}:\d{2}(AM|PM))-(\d{2}:\d{2}(AM|PM))\s(\w+|\w+\d+)\s?\/?\s?/;
    const match = rawText.match(regex);

    
    if (!match) {
      const regex1 = /([A-Z]\d+-[A-Z]{2}\d+)\s-\s(M|T|W|TH|F|SAT)\s(\d{2}:\d{2}(AM|PM))-(\d{2}:\d{2}(AM|PM))\s(\w+|\w+\d+)\s?\/?\s?/;
      const match1 = rawText.match(regex1);

      if(!match1) {
        const regex2 = /([A-Z]\d+-[A-Z]{2}\d+)\s-\s(M|T|W|TH|F|SAT)\s?\/?\s?(M|T|W|TH|F|SAT)\s?\/?\s?(M|T|W|TH|F|SAT)?\s(\d{2}:\d{2}(AM|PM))-(\d{2}:\d{2}(AM|PM))\s(\w+|\w+\d+)\s?\/?\s?(\d{2}:\d{2}(AM|PM))-(\d{2}:\d{2}(AM|PM))\s(\w+|\w+\d+)\s?\/?\s?(\d{2}:\d{2}(AM|PM))-(\d{2}:\d{2}(AM|PM))\s(\w+|\w+\d+)\s?\/?\s?/;
        const match2 = rawText.match(regex2);

        const [, , days1, days2, days3, temp_start1, , temp_end1, , desc1, temp_start2, , temp_end2, , desc2, temp_start3, , temp_end3, , desc3] = match2;
        start1 = convertTimeToISO(temp_start1);
        end1 = convertTimeToISO(temp_end1);
        start2 = convertTimeToISO(temp_start2);
        end2 = convertTimeToISO(temp_end2);
        start3 = convertTimeToISO(temp_start3);
        end3 = convertTimeToISO(temp_end3);
        const schedule1 = {
            title: title,
            description: desc1,
            start: start1,
            end: end1,
            day: daysMap[days1],
            type: 'classSchedule'
        };

        const schedule2 = {
            title: title,
            description: desc2,
            start: start2,
            end: end2,
            day: daysMap[days2],
            type: 'classSchedule'
        };

        const schedule3 = {
            title: title,
            description: desc3,
            start: start3,
            end: end3,
            day: daysMap[days3],
            type: 'classSchedule'
        };



        return [schedule1, schedule2, schedule3];
      }

      const [, , days1, temp_start1, , temp_end1, , desc1] = match1;
      start1 = convertTimeToISO(temp_start1);
      end1 = convertTimeToISO(temp_end1);
      const schedule1 = {
        title: title,
        description: desc1,
        start: start1,
        end: end1,
        day: daysMap[days1],
        type: 'classSchedule'
      };
      return schedule1;
    }

    const [, , days1, days2, temp_start1, , temp_end1, , desc1, temp_start2, , temp_end2, , desc2] = match;
    start1 = convertTimeToISO(temp_start1);
    end1 = convertTimeToISO(temp_end1);
    start2 = convertTimeToISO(temp_start2);
    end2 = convertTimeToISO(temp_end2);
    const schedule1 = {
        title: title,
        description: desc1,
        start: start1,
        end: end1,
        day: daysMap[days1],
        type: 'classSchedule'
    };

    const schedule2 = {
        title: title,
        description: desc2,
        start: start2,
        end: end2,
        day: daysMap[days2],
        type: 'classSchedule'
    };

    return [schedule1, schedule2];
  }

  function parseScheduleData(scheduleData) {
    const parsedData = [];

    scheduleData.forEach(schedule => {
      const twoSchedules = parseSchedule(schedule[8], schedule[2]);
      if (!Array.isArray(twoSchedules)) {
        parsedData.push(twoSchedules);
        return;
      } else if(twoSchedules.length === 3) {
        parsedData.push(twoSchedules[0]);
        parsedData.push(twoSchedules[1]);
        parsedData.push(twoSchedules[2]);
        return;
      }
      parsedData.push(twoSchedules[0]);
      parsedData.push(twoSchedules[1]);
    });
    return parsedData;
    
  }
  const parsedSchedule = parseScheduleData(scheduleData);
  await browser.close();
  return parsedSchedule;

};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));