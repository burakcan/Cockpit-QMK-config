ifneq ($(strip $(SECRET_1)),)
    $(info [DEBUG] Makefile received SECRET_1 with length: $(shell echo "$(SECRET_1)" | wc -c))
    ESCAPED_SECRET := $(subst ",\",$(SECRET_1))
    $(info [DEBUG] After escaping, length: $(shell echo "$(ESCAPED_SECRET)" | wc -c))
    OPT_DEFS += -DSECRET_1=\"$(ESCAPED_SECRET)\"
endif 