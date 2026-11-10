# Synthetic teaching example. No production services are contacted.
changes=[('price','promotion'),('price','promotion'),('price','promotion'),('price','promotion'),('price','promotion'),('checkout','payment')]
layer_owner={'price':'pricing-team','promotion':'campaign-team','checkout':'checkout-team','payment':'payments-team'}
cap_owner={'price':'checkout-team','promotion':'checkout-team','checkout':'checkout-team','payment':'payments-team'}
layer_cross=sum(layer_owner[a]!=layer_owner[b] for a,b in changes); capability_cross=sum(cap_owner[a]!=cap_owner[b] for a,b in changes); result={'layer_cross':layer_cross,'capability_cross':capability_cross}

# Show the final values when run from a terminal.
import json as _json
print(_json.dumps({k: globals()[k] for k in ['changes', 'layer_owner', 'cap_owner', 'layer_cross', 'capability_cross', 'result']}, indent=2))
