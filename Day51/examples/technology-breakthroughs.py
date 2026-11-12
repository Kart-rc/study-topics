# Synthetic teaching example. No production services are contacted.
reported={'best_mos2_mv_per_dec':61,'avg_mos2_mv_per_dec':68,'avg_wse2_mv_per_dec':79}
decades=6; swing=reported['best_mos2_mv_per_dec']
voltage_mv=decades*swing
result={'voltage_mv':voltage_mv,'paper_metric_reproduced':False,'manufacturing_ready':False}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['reported', 'decades', 'swing', 'voltage_mv', 'result']}, indent=2))
