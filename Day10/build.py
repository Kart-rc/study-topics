"""Render Day10 from its reviewed content and recorded code executions.
To regenerate executions first, run python scripts/walkthrough.py at repo root.
"""
import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
import render
render.render('Day10')
