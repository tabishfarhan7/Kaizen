import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'
import { exec } from 'child_process'

function CodeExecutorPlugin(): Plugin {
  return {
    name: 'code-executor',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/execute' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', () => {
            try {
              const { code, language } = JSON.parse(body);
              const runId = Date.now().toString() + Math.floor(Math.random() * 1000);
              const tmpDir = path.resolve(__dirname, 'tmp');
              if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

              let fileExt = '';
              let runCmd = '';
              let fileName = `script_${runId}`;

              let finalCode = code;

              if (language === 'C++') {
                fileExt = 'cpp';
                fileName = `Main_${runId}.cpp`;
                runCmd = `g++ ${tmpDir}/${fileName} -o ${tmpDir}/a_${runId}.out && ${tmpDir}/a_${runId}.out`;
                finalCode = `#include <iostream>\n#include <vector>\nusing namespace std;\n\n${code}\n\nint main() {\n    Solution sol;\n    vector<int> nums = {1, 2, 3};\n    vector<int> res = sol.solve(nums);\n    cout << "Executed successfully! Array size: " << res.size() << "\\n";\n    return 0;\n}`;
              } else if (language === 'Java') {
                fileExt = 'java';
                fileName = `Main_${runId}.java`;
                runCmd = `java ${tmpDir}/${fileName}`; // Works on Java 11+ directly
                finalCode = `import java.util.*;\n\npublic class Main_${runId} {\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        int[] nums = {1, 2, 3};\n        int[] res = sol.solve(nums);\n        System.out.println("Executed successfully! Array size: " + res.length);\n    }\n}\n\n${code}`;
              } else if (language === 'Python') {
                fileExt = 'py';
                fileName = `script_${runId}.py`;
                runCmd = `python3 ${tmpDir}/${fileName}`;
                finalCode = `from typing import List\n\n${code}\n\nif __name__ == "__main__":\n    sol = Solution()\n    print("Executed successfully! Array:", sol.solve([1, 2, 3]))`;
              } else if (language === 'JavaScript') {
                fileExt = 'js';
                fileName = `script_${runId}.js`;
                runCmd = `node ${tmpDir}/${fileName}`;
                finalCode = `${code}\n\nconsole.log("Executed successfully! Array:", solve([1, 2, 3]));`;
              }
              
              const filePath = path.join(tmpDir, fileName);
              fs.writeFileSync(filePath, finalCode);

              exec(runCmd, { timeout: 5000 }, (error, stdout, stderr) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  stdout: stdout || '',
                  stderr: stderr || '',
                  error: error ? error.message : null
                }));
                // Cleanup temp files safely after sending response
                setTimeout(() => {
                  try {
                    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                    if (language === 'C++' && fs.existsSync(`${tmpDir}/a_${runId}.out`)) fs.unlinkSync(`${tmpDir}/a_${runId}.out`);
                  } catch (e) {
                    console.error("Cleanup failed:", e);
                  }
                }, 100);
              });
            } catch (err) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid payload' }));
            }
          });
        } else {
          next();
        }
      });
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    CodeExecutorPlugin()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
