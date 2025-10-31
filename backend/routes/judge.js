    const express = require('express');
    const router = express.Router();
    const { runInDocker } = require('../utils/dockerRunner');
    const Submission = require('../models/Submission');
    const Problem = require('../models/Problem');

    // Guard: very small middleware to check auth can be added later
    router.post('/run', async (req, res) => {
      const { language, code, problemId } = req.body;
      if (!language || !code) return res.status(400).json({ error: 'language and code required' });
      try {
        let problem = null;
        if (problemId) problem = await Problem.findById(problemId);

        // If problem and testCases exist, create a wrapper that runs against them.
        let runCode = code;
        if (problem && problem.testCases && problem.testCases.length > 0){
          // We'll create a small runner that prints JSON results for each test case.
          if (language === 'javascript'){
            const cases = JSON.stringify(problem.testCases);
            runCode = `const __user = (function(){ ${code}; return typeof module !== 'undefined' && module.exports ? module.exports : this; })();\n` +
                      `const __cases = ${cases};\n` +
                      `const __results = [];
for (const tc of __cases){
  try{
    // assume user exposes a function if they define one; we'll attempt to call the first exported function or a named function by title
    // For simplicity we expect user writes a function and calls it or returns value via console.log in code
    // Here we simply execute the code and capture console output; more robust harnessing required for real judge
  } catch(e){ console.error(e) }
}
`;
            // For demo, just run original code
            runCode = code;
          } else if (language === 'python'){
            runCode = code;
          }
        }

        const result = await runInDocker({ language, code: runCode, timeout: 5000 });
        // store submission
        const submission = new Submission({
          user: null,
          problem: problem ? problem._id : null,
          language, code, result
        });
        await submission.save();
        res.json({ success: true, result });
      } catch (err){
        res.status(500).json({ error: String(err) });
      }
    });

    module.exports = router;
