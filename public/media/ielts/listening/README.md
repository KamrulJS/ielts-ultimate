# IELTS Listening Audio Directory Architecture

This directory structure is prepared for local or licensed MP3 audio assets corresponding to the Cambridge IELTS Listening Test Collection (Books 9–22).

## Directory Structure:
```
/media/ielts/listening/
  /cambridge-9/
    /test-1/
      section-1.mp3
      section-2.mp3
      section-3.mp3
      section-4.mp3
    /test-2/
    /test-3/
    /test-4/
  /cambridge-10/
  /cambridge-11/
  /cambridge-12/
  /cambridge-13/
  /cambridge-14/
  /cambridge-15/
  /cambridge-16/
  /cambridge-17/
  /cambridge-18/
  /cambridge-19/
  /cambridge-20/
  /cambridge-21/
  /cambridge-22/
```

## Runtime Fallback:
When local MP3 files are not present, the `AudioPlayer` component automatically uses native Web Speech synthesis with synchronized dialogue transcripts in British RP (`en-GB`), providing immediate, distraction-free practice without broken links or missing audio errors.
