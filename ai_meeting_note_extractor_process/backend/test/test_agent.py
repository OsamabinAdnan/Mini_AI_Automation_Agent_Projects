import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents import Runner
from agent import get_meeting_agent

# Test the agent directly
test_transcript = "Team meeting. Sarah will create dashboard by Friday. Alex will prepare report. Decision: Launch in June."

try:
    agent = get_meeting_agent("openrouter")
    print(f"Using agent: {agent.name}")

    print("Running agent...")
    result = Runner.run_sync(agent, test_transcript)
    print("Success! Result:")
    print(result.final_output)

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()