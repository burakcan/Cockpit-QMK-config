ifneq ($(strip $(SECRET_1)),)
    ESCAPED_SECRET := $(subst ",\",$(SECRET_1))
    OPT_DEFS += -DSECRET_1=\"$(ESCAPED_SECRET)\"
endif 