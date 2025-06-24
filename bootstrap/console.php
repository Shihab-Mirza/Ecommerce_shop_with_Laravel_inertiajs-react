<?php

use Illuminate\Support\Facades\Schedule;

// Schedule the command to run every minute
Schedule::command('offers:update-expired')->everyMinute();

// Alternatively, run daily at midnight
// Schedule::command('offers:update-expired')->daily();